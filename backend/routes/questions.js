const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { runCode, runTests } = require('../utils/testUtils');

// Get all topics
router.get('/topics', auth, async (req, res) => {
  try {
    const topics = await Question.distinct('topic');
    res.json(topics);
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ message: 'Error fetching topics' });
  }
});

// Get all questions for a topic
router.get('/topic/:topic', auth, async (req, res) => {
  try {
    const questions = await Question.find({ topic: req.params.topic })
      .sort({ order: 1 })
      .select('-solution');
    
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questions' });
  }
});

// Get all questions
router.get('/', auth, async (req, res) => {
  try {
    const questions = await Question.find().select('-testCases');
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Error fetching questions' });
  }
});

// Run code without test cases
router.post('/:id/run', auth, async (req, res) => {
  try {
    const { code, language } = req.body;
    const result = await runCode(code, language);
    res.json(result);
  } catch (error) {
    console.error('Error running code:', error);
    res.status(500).json({ error: 'Failed to run code' });
  }
});

// Submit solution with test cases
router.post('/:id/submit', auth, async (req, res) => {
  try {
    const { code, language } = req.body;
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const testResults = await runTests(code, language, question.testCases);
    const allTestsPassed = testResults.every(result => result.passed);

    if (allTestsPassed) {
      // Update user's completed questions
      const user = req.user;
      if (!user.completedQuestions.includes(question._id)) {
        user.completedQuestions.push(question._id);
        await user.save();
      }
    }

    res.json({ testResults });
  } catch (error) {
    console.error('Error submitting solution:', error);
    res.status(500).json({ error: 'Failed to submit solution' });
  }
});

// Get a single question
router.get('/:id', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json(question);
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({ message: 'Error fetching question' });
  }
});

// Create a new question
router.post('/', auth, async (req, res) => {
  try {
    const question = new Question(req.body);
    await question.save();
    res.status(201).json(question);
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ message: 'Error creating question' });
  }
});

// Update a question
router.put('/:id', auth, async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json(question);
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ message: 'Error updating question' });
  }
});

// Delete a question
router.delete('/:id', auth, async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ message: 'Error deleting question' });
  }
});

module.exports = router; 