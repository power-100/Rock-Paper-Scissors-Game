const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');
require('dotenv').config();

const sampleUsers = [
  {
    username: 'john_citizen',
    email: 'john@example.com',
    password: 'password123',
    fullName: 'John Citizen',
    location: 'Downtown, City Center',
    bio: 'Concerned citizen reporting local issues'
  },
  {
    username: 'sarah_local',
    email: 'sarah@example.com',
    password: 'password123',
    fullName: 'Sarah Local',
    location: 'Residential Area, Suburbs',
    bio: 'Community volunteer and local resident'
  },
  {
    username: 'mike_reporter',
    email: 'mike@example.com',
    password: 'password123',
    fullName: 'Mike Reporter',
    location: 'Business District',
    bio: 'Active in community development'
  },
  {
    username: 'emma_green',
    email: 'emma@example.com',
    password: 'password123',
    fullName: 'Emma Green',
    location: 'Park Avenue, Green Zone',
    bio: 'Environmental activist and local advocate'
  }
];

const samplePosts = [
  {
    title: 'Large Pothole on Main Street',
    description: 'There is a massive pothole on Main Street near the traffic light that is causing damage to vehicles. This has been an ongoing issue for weeks and needs immediate attention as it poses a safety risk to drivers.',
    category: 'infrastructure-roads',
    subcategory: 'Potholes',
    severity: 4,
    location: {
      type: 'Point',
      coordinates: [-74.006, 40.7128], // New York coordinates
      address: 'Main Street & 5th Avenue, Downtown',
      city: 'City Center',
      state: 'NY',
      country: 'USA'
    },
    images: [{
      url: '/uploads/posts/pothole-sample.jpg',
      filename: 'pothole-sample.jpg'
    }],
    voteCount: 23,
    commentCount: 5,
    views: 89,
    status: 'open'
  },
  {
    title: 'Broken Streetlight in Residential Area',
    description: 'The streetlight at the corner of Oak Street has been flickering for days and now completely stopped working. This area gets very dark at night making it unsafe for pedestrians and residents.',
    category: 'utilities-services',
    subcategory: 'Streetlight not working / flickering',
    severity: 3,
    location: {
      type: 'Point',
      coordinates: [-74.008, 40.7118],
      address: 'Oak Street & Elm Avenue',
      city: 'Residential District',
      state: 'NY',
      country: 'USA'
    },
    images: [{
      url: '/uploads/posts/streetlight-sample.jpg',
      filename: 'streetlight-sample.jpg'
    }],
    voteCount: 15,
    commentCount: 3,
    views: 45,
    status: 'open'
  },
  {
    title: 'Overflowing Garbage Bins at Central Park',
    description: 'The garbage bins near the main entrance of Central Park have been overflowing for several days. This is attracting pests and creating an unpleasant smell for visitors and nearby residents.',
    category: 'sanitation-waste',
    subcategory: 'Overflowing garbage bins',
    severity: 3,
    location: {
      type: 'Point',
      coordinates: [-73.9712, 40.7831],
      address: 'Central Park Main Entrance',
      city: 'Park District',
      state: 'NY',
      country: 'USA'
    },
    images: [{
      url: '/uploads/posts/garbage-sample.jpg',
      filename: 'garbage-sample.jpg'
    }],
    voteCount: 31,
    commentCount: 8,
    views: 112,
    status: 'in-progress'
  },
  {
    title: 'Fallen Tree Blocking Sidewalk',
    description: 'A large tree fell during the storm last night and is completely blocking the sidewalk on Pine Street. Pedestrians are forced to walk on the road which is dangerous, especially during peak hours.',
    category: 'environment-spaces',
    subcategory: 'Fallen trees / branches blocking way',
    severity: 5,
    location: {
      type: 'Point',
      coordinates: [-74.010, 40.7098],
      address: 'Pine Street between 2nd and 3rd Avenue',
      city: 'Green District',
      state: 'NY',
      country: 'USA'
    },
    images: [{
      url: '/uploads/posts/tree-sample.jpg',
      filename: 'tree-sample.jpg'
    }],
    voteCount: 47,
    commentCount: 12,
    views: 178,
    status: 'open'
  },
  {
    title: 'Damaged Bus Stop Shelter',
    description: 'The glass panels of the bus stop on Broadway are completely shattered, leaving commuters exposed to weather. This happened over a week ago and still hasn\'t been fixed.',
    category: 'transport-mobility',
    subcategory: 'Broken or missing bus stops / shelters',
    severity: 2,
    location: {
      type: 'Point',
      coordinates: [-73.9857, 40.7589],
      address: 'Broadway & 42nd Street',
      city: 'Transit Hub',
      state: 'NY',
      country: 'USA'
    },
    images: [{
      url: '/uploads/posts/busstop-sample.jpg',
      filename: 'busstop-sample.jpg'
    }],
    voteCount: 19,
    commentCount: 4,
    views: 67,
    status: 'open'
  },
  {
    title: 'Graffiti on Public Building',
    description: 'The side wall of the community center has been covered with graffiti. While some might consider it art, it\'s making the building look neglected and affecting the neighborhood\'s appearance.',
    category: 'safety-law-order',
    subcategory: 'Vandalism / graffiti',
    severity: 2,
    location: {
      type: 'Point',
      coordinates: [-74.005, 40.7108],
      address: 'Community Center, 1st Street',
      city: 'Community District',
      state: 'NY',
      country: 'USA'
    },
    images: [{
      url: '/uploads/posts/graffiti-sample.jpg',
      filename: 'graffiti-sample.jpg'
    }],
    voteCount: 8,
    commentCount: 6,
    views: 34,
    status: 'open'
  },
  {
    title: 'Stagnant Water in Park Area',
    description: 'There\'s a large puddle of stagnant water in Riverside Park that\'s been there for over two weeks. It\'s becoming a breeding ground for mosquitoes and poses a health risk to park visitors.',
    category: 'health-hygiene',
    subcategory: 'Stagnant water (mosquito breeding)',
    severity: 3,
    location: {
      type: 'Point',
      coordinates: [-73.9876, 40.7589],
      address: 'Riverside Park, Section B',
      city: 'Riverside',
      state: 'NY',
      country: 'USA'
    },
    images: [{
      url: '/uploads/posts/water-sample.jpg',
      filename: 'water-sample.jpg'
    }],
    voteCount: 26,
    commentCount: 7,
    views: 91,
    status: 'open'
  },
  {
    title: 'Illegal Vendor Blocking Sidewalk',
    description: 'An unlicensed food vendor has set up permanently on the sidewalk outside the metro station, blocking pedestrian traffic. People with wheelchairs and strollers can\'t pass through easily.',
    category: 'governance-community',
    subcategory: 'Unlicensed vendors causing obstruction',
    severity: 2,
    location: {
      type: 'Point',
      coordinates: [-74.001, 40.7138],
      address: 'Metro Station Entrance, Union Square',
      city: 'Commercial District',
      state: 'NY',
      country: 'USA'
    },
    images: [{
      url: '/uploads/posts/vendor-sample.jpg',
      filename: 'vendor-sample.jpg'
    }],
    voteCount: 14,
    commentCount: 9,
    views: 56,
    status: 'open'
  }
];

const sampleComments = [
  {
    content: 'I drive through this area daily and this pothole nearly damaged my car yesterday. Definitely needs urgent fixing!',
    postIndex: 0
  },
  {
    content: 'Reported this to the city last week but no response yet. Thanks for posting this!',
    postIndex: 0
  },
  {
    content: 'I walk this route every evening and it\'s really dark and unsafe now. Hope they fix it soon.',
    postIndex: 1
  },
  {
    content: 'This is so gross! I saw rats near the bins yesterday. City needs to increase pickup frequency.',
    postIndex: 2
  },
  {
    content: 'My kids play in this park and this is really concerning. When will this be cleaned up?',
    postIndex: 2
  },
  {
    content: 'This is extremely dangerous! Someone could get seriously injured. Needs immediate attention.',
    postIndex: 3
  },
  {
    content: 'I called 311 about this tree. They said they\'ll send a crew but that was 3 days ago.',
    postIndex: 3
  },
  {
    content: 'I wait at this stop every day for work. Getting soaked when it rains is not fun.',
    postIndex: 4
  },
  {
    content: 'Some of the graffiti actually looks pretty good, but I agree the building needs maintenance.',
    postIndex: 5
  },
  {
    content: 'The mosquitoes are terrible in this area now. My family can\'t enjoy the park anymore.',
    postIndex: 6
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/civicissues');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const createdUsers = [];
    for (let userData of sampleUsers) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`Created user: ${user.username}`);
    }

    // Create posts
    const createdPosts = [];
    for (let i = 0; i < samplePosts.length; i++) {
      const postData = samplePosts[i];
      postData.author = createdUsers[i % createdUsers.length]._id;
      
      // Add some random votes
      const numVotes = postData.voteCount;
      postData.votes = [];
      for (let j = 0; j < Math.min(numVotes, createdUsers.length); j++) {
        postData.votes.push({
          user: createdUsers[j]._id,
          votedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random date in last week
        });
      }

      const post = new Post(postData);
      await post.save();
      createdPosts.push(post);
      console.log(`Created post: ${post.title}`);
    }

    // Create comments
    for (let commentData of sampleComments) {
      const post = createdPosts[commentData.postIndex];
      const author = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      
      const comment = new Comment({
        content: commentData.content,
        author: author._id,
        post: post._id,
        createdAt: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000) // Random date in last 5 days
      });
      
      await comment.save();
      
      // Add comment to post
      post.comments.push(comment._id);
      post.commentCount += 1;
      await post.save();
      
      console.log(`Created comment for post: ${post.title}`);
    }

    // Update user post counts
    for (let user of createdUsers) {
      const postCount = await Post.countDocuments({ author: user._id });
      user.postsCount = postCount;
      await user.save();
    }

    console.log('\n✅ Database seeded successfully!');
    console.log(`Created ${createdUsers.length} users`);
    console.log(`Created ${createdPosts.length} posts`);
    console.log(`Created ${sampleComments.length} comments`);
    console.log('\n📝 Test Accounts:');
    console.log('Email: john@example.com | Password: password123');
    console.log('Email: sarah@example.com | Password: password123');
    console.log('Email: mike@example.com | Password: password123');
    console.log('Email: emma@example.com | Password: password123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase();
