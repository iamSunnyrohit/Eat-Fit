const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ActivityLog = require('../models/ActivityLog');

// Local fallback in-memory database
let localActivities = [
  {
    _id: 'act_1',
    userId: 'default_user',
    title: 'Functional Training',
    calories: 480,
    duration: 45,
    platformSource: 'HealthKit',
    date: new Date(Date.now() - 3600000)
  },
  {
    _id: 'act_2',
    userId: 'default_user',
    title: 'Morning Trail Run',
    calories: 320,
    duration: 30,
    platformSource: 'manual',
    date: new Date(Date.now() - 7200000)
  },
  {
    _id: 'act_3',
    userId: 'default_user',
    title: 'Active Recovery',
    calories: 120,
    duration: 20,
    platformSource: 'manual',
    date: new Date(Date.now() - 86400000)
  }
];

const isDbConnected = () => mongoose.connection.readyState === 1;

// @route   GET api/activities
// @desc    Get all activity logs
router.get('/', async (req, res) => {
  const userId = req.query.userId || 'default_user';

  if (isDbConnected()) {
    try {
      const activities = await ActivityLog.find({ userId }).sort({ date: -1 });
      return res.json(activities);
    } catch (err) {
      console.error('MongoDB fetch activities error, falling back to memory:', err.message);
    }
  }

  // In-memory fallback
  const userActivities = localActivities.filter(a => a.userId === userId);
  res.json(userActivities.slice().sort((a, b) => b.date - a.date));
});

// @route   POST api/activities
// @desc    Add a new activity log
router.post('/', async (req, res) => {
  const { userId, title, calories, duration, platformSource } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Activity title is required.' });
  }

  const activityData = {
    userId: userId || 'default_user',
    title,
    calories: Number(calories) || 0,
    duration: Number(duration) || 0,
    platformSource: platformSource || 'manual',
    date: new Date()
  };

  if (isDbConnected()) {
    try {
      const newLog = new ActivityLog(activityData);
      const savedLog = await newLog.save();
      return res.status(201).json(savedLog);
    } catch (err) {
      console.error('MongoDB save activity error, falling back to memory:', err.message);
    }
  }

  // In-memory fallback
  const mockLog = {
    _id: `mock_act_${Date.now()}`,
    ...activityData
  };
  localActivities.push(mockLog);
  console.log('[Fallback] Activity logged in-memory:', mockLog);
  res.status(201).json(mockLog);
});

// @route   DELETE api/activities/:id
// @desc    Delete an activity log
router.delete('/:id', async (req, res) => {
  if (isDbConnected()) {
    try {
      const log = await ActivityLog.findByIdAndDelete(req.params.id);
      if (log) {
        return res.json({ message: 'Activity log deleted successfully.', id: req.params.id });
      }
    } catch (err) {
      console.error('MongoDB delete activity error, falling back to memory:', err.message);
    }
  }

  // In-memory fallback
  const idx = localActivities.findIndex(a => a._id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ message: 'Activity log not found.' });
  }
  localActivities.splice(idx, 1);
  console.log(`[Fallback] Activity log deleted from memory: ${req.params.id}`);
  res.json({ message: 'Activity log deleted successfully from memory.', id: req.params.id });
});

module.exports = router;
