const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Profile = require('../models/Profile');

// Local in-memory store for fallback when database is not connected
let localProfiles = [];

// Helper to check if MongoDB is connected
const isDbConnected = () => mongoose.connection.readyState === 1;

// @route   POST api/profiles
// @desc    Create a new profile
router.post('/', async (req, res) => {
  const { nickname, dailyCalorieTarget, syncHealthDevices, healthPlatform, authProvider, email } = req.body;

  if (!nickname) {
    return res.status(400).json({ message: 'Nickname is required.' });
  }

  const profileData = {
    nickname,
    dailyCalorieTarget: dailyCalorieTarget || 2000,
    syncHealthDevices: syncHealthDevices || false,
    healthPlatform: healthPlatform || 'none',
    authProvider: authProvider || 'guest',
    email: email || ''
  };

  if (isDbConnected()) {
    try {
      const newProfile = new Profile(profileData);
      const savedProfile = await newProfile.save();
      return res.status(201).json(savedProfile);
    } catch (err) {
      console.error('MongoDB save error, falling back to in-memory:', err.message);
    }
  }

  // In-memory fallback
  const mockProfile = {
    _id: `mock_id_${Date.now()}`,
    ...profileData,
    createdAt: new Date()
  };
  localProfiles.push(mockProfile);
  console.log(`[Fallback] Profile created in-memory:`, mockProfile);
  res.status(201).json(mockProfile);
});

// @route   PUT api/profiles/:id
// @desc    Update profile by ID
router.put('/:id', async (req, res) => {
  const { nickname, dailyCalorieTarget, syncHealthDevices, healthPlatform, authProvider, email } = req.body;

  if (isDbConnected()) {
    try {
      let profile = await Profile.findById(req.params.id);
      if (profile) {
        if (nickname !== undefined) profile.nickname = nickname;
        if (dailyCalorieTarget !== undefined) profile.dailyCalorieTarget = dailyCalorieTarget;
        if (syncHealthDevices !== undefined) profile.syncHealthDevices = syncHealthDevices;
        if (healthPlatform !== undefined) profile.healthPlatform = healthPlatform;
        if (authProvider !== undefined) profile.authProvider = authProvider;
        if (email !== undefined) profile.email = email;

        const updatedProfile = await profile.save();
        return res.json(updatedProfile);
      }
    } catch (err) {
      console.error('MongoDB update error, falling back to in-memory:', err.message);
    }
  }

  // In-memory fallback
  let profile = localProfiles.find(p => p._id === req.params.id);
  if (!profile) {
    return res.status(404).json({ message: 'Profile not found in memory.' });
  }

  if (nickname !== undefined) profile.nickname = nickname;
  if (dailyCalorieTarget !== undefined) profile.dailyCalorieTarget = dailyCalorieTarget;
  if (syncHealthDevices !== undefined) profile.syncHealthDevices = syncHealthDevices;
  if (healthPlatform !== undefined) profile.healthPlatform = healthPlatform;
  if (authProvider !== undefined) profile.authProvider = authProvider;
  if (email !== undefined) profile.email = email;

  console.log(`[Fallback] Profile updated in-memory:`, profile);
  res.json(profile);
});

// @route   GET api/profiles/:id
// @desc    Get profile by ID
router.get('/:id', async (req, res) => {
  if (isDbConnected()) {
    try {
      const profile = await Profile.findById(req.params.id);
      if (profile) {
        return res.json(profile);
      }
    } catch (err) {
      console.error('MongoDB get error, falling back to in-memory:', err.message);
    }
  }

  // In-memory fallback
  const profile = localProfiles.find(p => p._id === req.params.id);
  if (!profile) {
    return res.status(404).json({ message: 'Profile not found in memory.' });
  }
  res.json(profile);
});

// @route   GET api/profiles
// @desc    Get all profiles (for testing/debugging)
router.get('/', async (req, res) => {
  if (isDbConnected()) {
    try {
      const profiles = await Profile.find().sort({ createdAt: -1 });
      return res.json(profiles);
    } catch (err) {
      console.error('MongoDB fetch all error, falling back to in-memory:', err.message);
    }
  }

  // In-memory fallback
  res.json(localProfiles.slice().reverse());
});

module.exports = router;
