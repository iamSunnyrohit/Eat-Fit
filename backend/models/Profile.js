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
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Profile', ProfileSchema);
