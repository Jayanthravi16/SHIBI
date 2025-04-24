const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log('Registration attempt for email:', email);

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    console.log('Existing user check result:', existingUser ? 'User found' : 'No user found');

    if (existingUser) {
      console.log('Email already registered:', email);
      return res.status(400).json({ 
        error: 'Email already registered',
        details: 'Please use a different email address or try logging in'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      progress: new Map([
        ['loops', { completed: 0, total: 10 }],
        ['conditionals', { completed: 0, total: 10 }],
        ['arrays', { completed: 0, total: 10 }],
        ['functions', { completed: 0, total: 10 }],
        ['strings', { completed: 0, total: 10 }]
      ])
    });

    // Save user to database
    await user.save();
    console.log('New user created successfully:', user.email);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data (excluding password)
    const userData = user.toObject();
    delete userData.password;

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: userData
    });
  } catch (error) {
    console.error('Registration error details:', {
      name: error.name,
      code: error.code,
      message: error.message,
      stack: error.stack
    });

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      console.log('Validation errors:', errors);
      return res.status(400).json({
        error: 'Validation failed',
        details: errors
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      console.log('Duplicate key error for email');
      return res.status(400).json({
        error: 'Email already registered',
        details: 'Please use a different email address or try logging in'
      });
    }

    res.status(500).json({
      error: 'Registration failed',
      details: 'An unexpected error occurred. Please try again.'
    });
  }
});

// Manual login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    console.log('User lookup result:', user ? 'User found' : 'No user found');

    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        details: 'Email or password is incorrect'
      });
    }

    // Check if user has password (Google users won't have password)
    if (!user.password) {
      return res.status(401).json({ message: 'Please sign in with Google' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isMatch ? 'Password matched' : 'Password did not match');

    if (!isMatch) {
      return res.status(401).json({
        error: 'Invalid credentials',
        details: 'Email or password is incorrect'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data (excluding password)
    const userData = user.toObject();
    delete userData.password;

    res.json({
      message: 'Login successful',
      token,
      user: userData
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      details: 'An unexpected error occurred. Please try again.'
    });
  }
});

// Google OAuth login
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ message: 'No token provided' });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const { email, name, picture, sub: googleId } = ticket.getPayload();

    if (!email || !name || !googleId) {
      return res.status(400).json({ message: 'Invalid Google token payload' });
    }

    // Find or create user
    let user = await User.findOne({ googleId });

    if (!user) {
      // Check if user exists with email but no googleId
      user = await User.findOne({ email });
      
      if (user) {
        // Update existing user with googleId
        user.googleId = googleId;
        user.profilePicture = picture;
        await user.save();
      } else {
        // Create new user
        user = await User.create({
          email,
          name,
          googleId,
          profilePicture: picture,
          progress: new Map([
            ['loops', { completed: 0, total: 10 }],
            ['conditionals', { completed: 0, total: 10 }],
            ['arrays', { completed: 0, total: 10 }],
            ['functions', { completed: 0, total: 10 }],
            ['strings', { completed: 0, total: 10 }]
          ])
        });
      }
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        profilePicture: user.profilePicture,
        progress: user.progress,
        preferredLanguage: user.preferredLanguage
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    if (error.name === 'TokenError') {
      return res.status(401).json({ message: 'Invalid Google token' });
    }
    res.status(500).json({ message: 'Authentication failed' });
  }
});

// Google OAuth redirect handler
router.get('/google', async (req, res) => {
  try {
    const { code } = req.query;
    
    if (!code) {
      return res.redirect('/login?error=no_code');
    }

    const { tokens } = await client.getToken({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${process.env.FRONTEND_URL}/auth/google/callback`
    });

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const { email, name, picture, sub: googleId } = ticket.getPayload();

    if (!email || !name || !googleId) {
      return res.redirect('/login?error=invalid_token');
    }

    // Find or create user
    let user = await User.findOne({ googleId });

    if (!user) {
      // Check if user exists with email but no googleId
      user = await User.findOne({ email });
      
      if (user) {
        // Update existing user with googleId
        user.googleId = googleId;
        user.profilePicture = picture;
        await user.save();
      } else {
        // Create new user
        user = await User.create({
          email,
          name,
          googleId,
          profilePicture: picture,
          progress: new Map([
            ['loops', { completed: 0, total: 10 }],
            ['conditionals', { completed: 0, total: 10 }],
            ['arrays', { completed: 0, total: 10 }],
            ['functions', { completed: 0, total: 10 }],
            ['strings', { completed: 0, total: 10 }]
          ])
        });
      }
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/google/callback?token=${jwtToken}`);
  } catch (error) {
    console.error('Google auth error:', error);
    res.redirect('/login?error=auth_failed');
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        details: 'The requested user does not exist'
      });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Failed to get user data',
      details: 'An unexpected error occurred. Please try again.'
    });
  }
});

module.exports = router; 