const express = require('express');
const router = express.Router();
const User = require('../models/User');

const auth = require('../middleware/auth');

// @route   GET api/users/me
// @desc    Get current logged in user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('name');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/users
// @desc    Get all registered users (name and profilePic)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('name profilePic dailyScore lastPlayedDate -_id');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/users/score
// @desc    Update daily score for logged in user
router.post('/score', auth, async (req, res) => {
  try {
    const { score, date } = req.body;
    
    // Find user and update
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.dailyScore = score;
    user.lastPlayedDate = date;
    
    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
