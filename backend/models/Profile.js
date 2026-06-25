const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: true,
    trim: true
  },
  dailyCalorieTarget: {
    type: Number,
    required: true,
    default: 2000
  },
  syncHealthDevices: {
    type: Boolean,
    default: false
  },
  healthPlatform: {
    type: String,
    enum: ['ios', 'android', 'none'],
    default: 'none'
  },
  authProvider: {
    type: String,
    enum: ['apple', 'google', 'guest'],
    default: 'guest'
  },
  email: {
    type: String,
    trim: true,
    default: 'alex.rivers@example.com'
  },
  twoFactorEnabled: {
    type: Boolean,
    default: true
  },
  biometricsEnabled: {
    type: Boolean,
    default: false
  },
  lastPasswordChange: {
    type: Date,
    default: () => {
      const d = new Date();
      d.setMonth(d.getMonth() - 4);
      return d;
    }
  },
  loggedInDevices: {
    type: [
      {
        deviceId: String,
        model: String,
        location: String,
        lastActive: String
      }
    ],
    default: [
      {
        deviceId: 'dev_mac',
        model: 'MacBook Pro 16"',
        location: 'Mumbai, India',
        lastActive: 'Active Now'
      },
      {
        deviceId: 'dev_iphone',
        model: 'iPhone 15 Pro',
        location: 'New Delhi, India',
        lastActive: '2 hours ago'
      }
    ]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Profile', ProfileSchema);
