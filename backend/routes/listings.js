const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const { protect } = require('../middleware/auth');

// GET /api/listings — public
router.get('/', async (req, res) => {
  try {
    const { location, type, listingMode } = req.query;
    const filter = { status: 'active' };
    if (location) filter.location = new RegExp(location, 'i');
    if (type) filter.type = type;
    if (listingMode) filter.listingMode = listingMode;

    const listings = await Listing.find(filter).populate('sellerID', 'name email');
    res.json({ listings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/listings/:id — public
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('sellerID', 'name email');
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    res.json({ listing });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/listings — seller only
router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'seller') return res.status(403).json({ error: 'Sellers only' });
    const listing = await Listing.create({ ...req.body, sellerID: req.user._id });
    res.status(201).json({ listing });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/listings/:id — seller only
router.put('/:id', protect, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    if (listing.sellerID.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not your listing' });
    }
    const updated = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ listing: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/listings/:id — seller only
router.delete('/:id', protect, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    if (listing.sellerID.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not your listing' });
    }
    await Listing.findByIdAndUpdate(req.params.id, { status: 'deleted' });
    res.json({ message: 'Listing deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;