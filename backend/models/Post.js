const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  category: {
    type: String,
    required: true,
    enum: [
      'infrastructure-roads',
      'utilities-services',
      'sanitation-waste',
      'environment-spaces',
      'transport-mobility',
      'safety-law-order',
      'health-hygiene',
      'governance-community'
    ]
  },
  subcategory: {
    type: String,
    required: true,
    trim: true
  },
  severity: {
    type: Number,
    required: true,
    min: 1,
    max: 5 // 1 = Low, 2 = Minor, 3 = Moderate, 4 = High, 5 = Critical
  },
  images: [{
    url: String,
    filename: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    },
    city: String,
    state: String,
    country: String
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  votes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    votedAt: {
      type: Date,
      default: Date.now
    }
  }],
  voteCount: {
    type: Number,
    default: 0
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  commentCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved', 'closed'],
    default: 'open'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  reportedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for geospatial queries
postSchema.index({ location: '2dsphere' });
postSchema.index({ category: 1, 'location.coordinates': '2dsphere' });
postSchema.index({ createdAt: -1 });
postSchema.index({ voteCount: -1 });
postSchema.index({ status: 1 });

module.exports = mongoose.model('Post', postSchema);
