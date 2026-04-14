const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const { protect } = require('../middleware/auth');
const { cloudinary, upload } = require('../config/cloudinary');

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

// UPLOAD PHOTOS — must be before /:id to avoid route conflict
router.post('/:id/upload', protect, upload.array('files', 10), async (req, res) => {
  try {
    console.log('Files received:', req.files?.length);
    console.log('Listing ID:', req.params.id);

    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    if (listing.sellerID.toString() !== req.user._id.toString())
      return res.status(403).json({ error: 'Not authorised' });

    if (!req.files || req.files.length === 0)
      return res.status(400).json({ error: 'No files received' });

    const uploaded = await Promise.all(req.files.map(f => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'homefinder', resource_type: 'image' },
          (err, result) => {
            if (err) { console.error('Cloudinary error:', err); reject(err); }
            else resolve(result);
          }
        );
        stream.end(f.buffer);
      });
    }));

    const newFiles = uploaded.map(r => ({
      fileName: r.original_filename,
      fileType: 'image',
      fileURL:  r.secure_url
    }));

    listing.files.push(...newFiles);
    await listing.save();

    res.json({ listing });
  } catch (err) {
    console.error('Upload route error:', err.message);
    res.status(500).json({ error: err.message });
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
    if (listing.sellerID.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not your listing' });
    }
    const updated = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ listing: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/listings/:id — seller or admin
router.delete('/:id', protect, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    if (listing.sellerID.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not your listing' });
    }
    await Listing.findByIdAndUpdate(req.params.id, { status: 'deleted' });
    res.json({ message: 'Listing deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;