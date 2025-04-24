const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; // Password is required only if not using Google auth
    }
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true // Allows null values for non-Google users
  },
  profilePicture: {
    type: String,
  },
  completedQuestions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  progress: {
    type: Map,
    of: {
      completed: Number,
      total: Number
    },
    default: new Map()
  },
  preferredLanguage: {
    type: String,
    enum: ['python', 'java', 'cpp'],
    default: 'python'
  }
}, {
  timestamps: true
});

// Add index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });

module.exports = mongoose.model('User', userSchema); 