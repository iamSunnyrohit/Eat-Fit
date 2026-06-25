const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const profileRoutes = require('./routes/profile');
const activityRoutes = require('./routes/activity');
const mealRoutes = require('./routes/meal');
const subscriptionRoutes = require('./routes/subscription');
const securityRoutes = require('./routes/security');

app.use('/api/profiles', profileRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/security', securityRoutes);

// Base route for server checking
app.get('/', (req, res) => {
  res.json({
    message: 'Eat & Fit Backend API is running successfully!',
    databaseConnected: mongoose.connection.readyState === 1
  });
});

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/eat_and_fit';
console.log('Connecting to MongoDB...');

mongoose.connect(mongoURI, {
  serverSelectionTimeoutMS: 3000 // Don't block server startup if DB is down
})
  .then(() => {
    console.log('MongoDB successfully connected.');
  })
  .catch((err) => {
    console.warn('\n======================================================');
    console.warn('WARNING: Failed to connect to MongoDB.');
    console.warn('Reason:', err.message);
    console.warn('The API server will continue running using an IN-MEMORY fallback database.');
    console.warn('======================================================\n');
  });

// Start Server
app.listen(PORT, () => {
  console.log(`Eat & Fit Server running on http://localhost:${PORT}`);
});
