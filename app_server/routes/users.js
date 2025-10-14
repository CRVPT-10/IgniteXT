var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../models/user');

// --------------------
// REGISTER
// --------------------
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required, including role' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    // Create user (plain password)
    const newUser = new User({ name, email, password, role });
    await newUser.save();

    // Generate JWT
    const token = jwt.sign(
      { _id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1h' }
    );

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// --------------------
// LOGIN
// --------------------
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { _id: user._id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed' });
  }
});

module.exports = router;
