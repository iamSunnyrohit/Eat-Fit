const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const MealLog = require('../models/MealLog');

// Local fallback in-memory database
let localMeals = [
  {
    _id: 'meal_1',
    userId: 'default_user',
    name: 'Morning Protein Bowl',
    category: 'Breakfast',
    calories: 420,
    protein: 35,
    carbs: 45,
    fat: 10,
    date: new Date(Date.now() - 3600000)
  },
  {
    _id: 'meal_2',
    userId: 'default_user',
    name: 'Grilled Chicken Salad',
    category: 'Lunch',
    calories: 580,
    protein: 48,
    carbs: 22,
    fat: 18,
    date: new Date(Date.now() - 7200000)
  },
  {
    _id: 'meal_3',
    userId: 'default_user',
    name: 'Whey Isolate Shake',
    category: 'Post-Workout',
    calories: 210,
    protein: 26,
    carbs: 3,
    fat: 1,
    date: new Date(Date.now() - 14400000)
  },
  {
    _id: 'meal_4',
    userId: 'default_user',
    name: 'Roasted Salmon & Asparagus',
    category: 'Dinner',
    calories: 630,
    protein: 42,
    carbs: 12,
    fat: 25,
    date: new Date(Date.now() - 21600000)
  }
];

const isDbConnected = () => mongoose.connection.readyState === 1;

// @route   GET api/meals
// @desc    Get all logged meals
router.get('/', async (req, res) => {
  const userId = req.query.userId || 'default_user';

  if (isDbConnected()) {
    try {
      const meals = await MealLog.find({ userId }).sort({ date: -1 });
      return res.json(meals);
    } catch (err) {
      console.error('MongoDB fetch meals error, falling back to memory:', err.message);
    }
  }

  // In-memory fallback
  const userMeals = localMeals.filter(m => m.userId === userId);
  res.json(userMeals.slice().sort((a, b) => b.date - a.date));
});

// @route   POST api/meals
// @desc    Add a new logged meal entry
router.post('/', async (req, res) => {
  const { userId, name, category, calories, protein, carbs, fat } = req.body;

  if (!name || !category) {
    return res.status(400).json({ message: 'Meal name and category are required.' });
  }

  const mealData = {
    userId: userId || 'default_user',
    name,
    category,
    calories: Number(calories) || 0,
    protein: Number(protein) || 0,
    carbs: Number(carbs) || 0,
    fat: Number(fat) || 0,
    date: new Date()
  };

  if (isDbConnected()) {
    try {
      const newMeal = new MealLog(mealData);
      const savedMeal = await newMeal.save();
      return res.status(201).json(savedMeal);
    } catch (err) {
      console.error('MongoDB save meal error, falling back to memory:', err.message);
    }
  }

  // In-memory fallback
  const mockMeal = {
    _id: `mock_meal_${Date.now()}`,
    ...mealData
  };
  localMeals.push(mockMeal);
  console.log('[Fallback] Meal logged in-memory:', mockMeal);
  res.status(201).json(mockMeal);
});

// @route   DELETE api/meals/:id
// @desc    Delete a logged meal entry
router.delete('/:id', async (req, res) => {
  if (isDbConnected()) {
    try {
      const meal = await MealLog.findByIdAndDelete(req.params.id);
      if (meal) {
        return res.json({ message: 'Meal log deleted successfully.', id: req.params.id });
      }
    } catch (err) {
      console.error('MongoDB delete meal error, falling back to memory:', err.message);
    }
  }

  // In-memory fallback
  const idx = localMeals.findIndex(m => m._id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ message: 'Meal log not found.' });
  }
  localMeals.splice(idx, 1);
  console.log(`[Fallback] Meal log deleted from memory: ${req.params.id}`);
  res.json({ message: 'Meal log deleted successfully from memory.', id: req.params.id });
});

module.exports = router;
