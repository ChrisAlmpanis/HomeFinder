const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/users — admin only
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash');
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/users/:id/approve — admin approves buyer
router.put('/:id/approve', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id, { isApproved: true }, { new: true }
    ).select('-passwordHash');
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/users/me — get own profile
router.get('/me', protect, async (req, res) => {
  res.json({ user: req.user });
});

// GET /api/users/admins — any logged in user can get admin list for support
router.get('/admins', protect, async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' }).select('name email role');
    res.json({ users: admins });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;