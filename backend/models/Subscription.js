const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  planName: {
    type: String,
    required: true,
    default: 'Annual Pro'
  },
  price: {
    type: Number,
    required: true,
    default: 1800
  },
  currency: {
    type: String,
    required: true,
    default: 'INR'
  },
  status: {
    type: String,
    enum: ['Active', 'Expired', 'Cancelled'],
    default: 'Active'
  },
  renewalDate: {
    type: Date,
    default: () => {
      const oneYear = new Date();
      oneYear.setFullYear(oneYear.getFullYear() + 1);
      return oneYear;
    }
  },
  paymentCardType: {
    type: String,
    default: 'Visa'
  },
  paymentCardLast4: {
    type: String,
    default: '4242'
  },
  paymentCardExpiry: {
    type: String,
    default: '12/26'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);
