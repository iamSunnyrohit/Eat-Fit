const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Subscription = require('../models/Subscription');

// Local fallback in-memory database
let localSubscriptions = {};

const isDbConnected = () => mongoose.connection.readyState === 1;

// @route   GET api/subscriptions
// @desc    Get subscription profile of user
router.get('/', async (req, res) => {
  const userId = req.query.userId || 'default_user';

  if (isDbConnected()) {
    try {
      let sub = await Subscription.findOne({ userId });
      if (!sub) {
        // Automatically provision an Active Annual Pro plan if not found
        sub = new Subscription({ userId });
        await sub.save();
      }
      return res.json(sub);
    } catch (err) {
      console.error('MongoDB fetch subscription error, falling back to memory:', err.message);
    }
  }

  // In-memory fallback
  if (!localSubscriptions[userId]) {
    const oneYear = new Date();
    oneYear.setFullYear(oneYear.getFullYear() + 1);
    localSubscriptions[userId] = {
      _id: `mock_sub_${Date.now()}`,
      userId,
      planName: 'Annual Pro',
      price: 1800,
      currency: 'INR',
      status: 'Active',
      renewalDate: oneYear,
      paymentCardType: 'Visa',
      paymentCardLast4: '4242',
      paymentCardExpiry: '12/26',
      createdAt: new Date()
    };
  }

  res.json(localSubscriptions[userId]);
});

// @route   POST api/subscriptions
// @desc    Provision or update user subscription
router.post('/', async (req, res) => {
  const { userId, planName, price, currency, status, paymentCardType, paymentCardLast4, paymentCardExpiry } = req.body;
  const targetUserId = userId || 'default_user';

  const subData = {
    planName: planName || 'Annual Pro',
    price: Number(price) || 1800,
    currency: currency || 'INR',
    status: status || 'Active',
    paymentCardType: paymentCardType || 'Visa',
    paymentCardLast4: paymentCardLast4 || '4242',
    paymentCardExpiry: paymentCardExpiry || '12/26'
  };

  if (isDbConnected()) {
    try {
      let sub = await Subscription.findOne({ userId: targetUserId });
      if (sub) {
        Object.assign(sub, subData);
        await sub.save();
        return res.json(sub);
      } else {
        sub = new Subscription({ userId: targetUserId, ...subData });
        const savedSub = await sub.save();
        return res.status(201).json(savedSub);
      }
    } catch (err) {
      console.error('MongoDB update subscription error, falling back to memory:', err.message);
    }
  }

  // In-memory fallback
  if (!localSubscriptions[targetUserId]) {
    const oneYear = new Date();
    oneYear.setFullYear(oneYear.getFullYear() + 1);
    localSubscriptions[targetUserId] = {
      _id: `mock_sub_${Date.now()}`,
      userId: targetUserId,
      renewalDate: oneYear,
      createdAt: new Date()
    };
  }

  Object.assign(localSubscriptions[targetUserId], subData);
  console.log('[Fallback] Subscription updated in-memory:', localSubscriptions[targetUserId]);
  res.json(localSubscriptions[targetUserId]);
});

module.exports = router;
