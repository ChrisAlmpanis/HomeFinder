const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');

// GET all conversations for current user
router.get('/', protect, async (req, res) => {
  try {
    const userID = req.user._id;
    const messages = await Message.find({
      $or: [{ senderID: userID }, { receiverID: userID }]
    })
    .populate('senderID', 'name role')
    .populate('receiverID', 'name role')
    .populate('listingID', 'title location')
    .sort({ createdAt: 1 });

    // Group into conversations
    const convos = {};
    messages.forEach(m => {
      const other = m.senderID._id.toString() === userID.toString() ? m.receiverID : m.senderID;
      const key = other._id.toString();
      if (!convos[key]) convos[key] = { other, listing: m.listingID, messages: [], unread: 0 };
      convos[key].messages.push(m);
      if (!m.isRead && m.receiverID._id.toString() === userID.toString()) convos[key].unread++;
    });

    res.json({ conversations: Object.values(convos) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST send a message
router.post('/', protect, async (req, res) => {
  try {
    console.log('Message body:', req.body);
    console.log('Sender:', req.user._id);
    const { receiverID, listingID, content } = req.body;
    const message = await Message.create({
      senderID: req.user._id, receiverID, listingID, content
    });
    await message.populate('senderID', 'name role');
    await message.populate('receiverID', 'name role');
    await message.populate('listingID', 'title location');
    res.status(201).json({ message });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT mark messages as read
router.put('/read/:otherUserID', protect, async (req, res) => {
  try {
    await Message.updateMany(
      { senderID: req.params.otherUserID, receiverID: req.user._id, isRead: false },
      { isRead: true }
    );
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;