const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
    enum: ['loops', 'conditionals', 'arrays']
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard']
  },
  testCases: [{
    input: String,
    output: String
  }],
  starterCode: {
    python: String,
    java: String,
    cpp: String
  },
  solution: {
    python: String,
    java: String,
    cpp: String
  },
  hints: [String],
  order: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

// Add indexes for faster queries
questionSchema.index({ topic: 1 });
questionSchema.index({ difficulty: 1 });

module.exports = mongoose.model('Question', questionSchema); 