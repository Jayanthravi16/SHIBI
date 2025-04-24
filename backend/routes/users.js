const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-googleId')
      .populate('completedQuestions.questionId', 'title topic');
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Update preferred language
router.patch('/language', auth, async (req, res) => {
  try {
    const { language } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { preferredLanguage: language },
      { new: true }
    );
    
    res.json({ preferredLanguage: user.preferredLanguage });
  } catch (error) {
    res.status(500).json({ message: 'Error updating language preference' });
  }
});

// Get progress for all topics
router.get('/progress', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.json(Object.fromEntries(user.progress));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching progress' });
  }
});

// Get completed questions
router.get('/completed', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('completedQuestions.questionId', 'title topic difficulty');
    
    res.json(user.completedQuestions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching completed questions' });
  }
});

module.exports = router; 