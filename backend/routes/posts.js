const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/posts/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `post-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get all posts with filters and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      severity,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      lat,
      lng,
      radius = 5000, // 5km default radius
      search
    } = req.query;

    const query = { isActive: true };

    // Category filter
    if (category) {
      query.category = category;
    }

    // Severity filter
    if (severity) {
      query.severity = severity;
    }

    // Status filter
    if (status) {
      query.status = status;
    }

    // Location-based filter
    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius)
        }
      };
    }

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const posts = await Post.find(query)
      .populate('author', 'username fullName avatar')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username fullName avatar'
        },
        options: { limit: 3, sort: { createdAt: -1 } }
      })
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean();

    const totalPosts = await Post.countDocuments(query);

    res.json({
      success: true,
      posts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalPosts / parseInt(limit)),
        totalPosts,
        hasNextPage: parseInt(page) < Math.ceil(totalPosts / parseInt(limit)),
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching posts'
    });
  }
});

// Get similar posts (for duplicate detection)
router.get('/similar', async (req, res) => {
  try {
    const { category, lat, lng, radius = 1000 } = req.query;

    if (!category || !lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Category and location are required'
      });
    }

    const similarPosts = await Post.find({
      category,
      status: { $in: ['open', 'in-progress'] },
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius)
        }
      }
    })
    .populate('author', 'username fullName avatar')
    .limit(5)
    .lean();

    res.json({
      success: true,
      similarPosts
    });
  } catch (error) {
    console.error('Get similar posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching similar posts'
    });
  }
});

// Create new post
router.post('/', auth, upload.array('images', 5), async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      subcategory,
      severity,
      address,
      lat,
      lng,
      city,
      state,
      country
    } = req.body;

    // Validate required fields
    if (!title || !description || !category || !subcategory || !severity || !address || !lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Process uploaded images
    const images = req.files ? req.files.map(file => ({
      url: `/uploads/posts/${file.filename}`,
      filename: file.filename
    })) : [];

    // Create post
    const post = new Post({
      title,
      description,
      category,
      subcategory,
      severity: parseInt(severity),
      images,
      location: {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)],
        address,
        city,
        state,
        country
      },
      author: req.userId
    });

    await post.save();
    await post.populate('author', 'username fullName avatar');

    // Update user's post count
    await User.findByIdAndUpdate(req.userId, { $inc: { postsCount: 1 } });

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating post'
    });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username fullName avatar location')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username fullName avatar'
        },
        options: { sort: { createdAt: -1 } }
      });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Increment view count
    post.views += 1;
    await post.save();

    res.json({
      success: true,
      post
    });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching post'
    });
  }
});

// Vote on post
router.post('/:id/vote', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user already voted
    const existingVoteIndex = post.votes.findIndex(
      vote => vote.user.toString() === req.userId
    );

    if (existingVoteIndex > -1) {
      // Remove vote (toggle)
      post.votes.splice(existingVoteIndex, 1);
      post.voteCount -= 1;
      await User.findByIdAndUpdate(req.userId, { $inc: { votesGiven: -1 } });
    } else {
      // Add vote
      post.votes.push({ user: req.userId });
      post.voteCount += 1;
      await User.findByIdAndUpdate(req.userId, { $inc: { votesGiven: 1 } });
    }

    await post.save();

    res.json({
      success: true,
      message: existingVoteIndex > -1 ? 'Vote removed' : 'Vote added',
      voteCount: post.voteCount,
      hasVoted: existingVoteIndex === -1
    });
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing vote'
    });
  }
});

// Add comment to post
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { content, parentComment } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required'
      });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const comment = new Comment({
      content: content.trim(),
      author: req.userId,
      post: req.params.id,
      parentComment: parentComment || null
    });

    await comment.save();
    await comment.populate('author', 'username fullName avatar');

    // Add comment to post
    post.comments.push(comment._id);
    post.commentCount += 1;
    await post.save();

    // If it's a reply, add to parent comment
    if (parentComment) {
      await Comment.findByIdAndUpdate(parentComment, {
        $push: { replies: comment._id }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding comment'
    });
  }
});

module.exports = router;
