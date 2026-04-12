const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { protect } = require('../middleware/auth');

// GET /api/appointments — buyer sees own, admin sees all
router.get('/', protect, async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { buyerID: req.user._id };
    const appointments = await Appointment.find(filter)
      .populate('buyerID', 'name email')
      .populate({
        path: 'listingID',
        select: 'title location sellerID',
        populate: { path: 'sellerID', select: 'name' }
      });
    res.json({ appointments });
  } catch (error) {
    console.error('Appointments error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/appointments — buyer only
router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'buyer') return res.status(403).json({ error: 'Buyers only' });

    const { listingID, scheduledAt, time } = req.body;

    // Check slot availability
    const conflict = await Appointment.findOne({
      listingID,
      scheduledAt: new Date(scheduledAt),
      status: { $ne: 'cancelled' }
    });
    if (conflict) return res.status(409).json({ error: 'Slot unavailable' });

    const appointment = await Appointment.create({
      buyerID: req.user._id, listingID, scheduledAt, time, status: 'confirmed'
    });
    res.status(201).json({ appointment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/appointments/:id — buyer reschedules own
router.put('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Not found' });
    if (appointment.buyerID.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorised' });
    }
    const updated = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ appointment: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/appointments/:id — buyer cancels own
router.delete('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Not found' });
    if (appointment.buyerID.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorised' });
    }
    await Appointment.findByIdAndUpdate(req.params.id, { status: 'cancelled' });
    res.json({ message: 'Appointment cancelled' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;