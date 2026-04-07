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

module.exports = router;