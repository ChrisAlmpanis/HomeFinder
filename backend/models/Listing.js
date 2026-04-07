const mongoose = require('mongoose');

const fileAssetSchema = new mongoose.Schema({
  fileName:   { type: String, required: true },
  fileType:   { type: String, enum: ['image', 'video'], required: true },
  fileURL:    { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

const listingSchema = new mongoose.Schema({
  sellerID:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:       { type: String, required: true },
  description: { type: String },
  price:       { type: Number, required: true },
  location:    { type: String, required: true },
  type:        { type: String, enum: ['House', 'Apartment', 'Studio'], required: true },
  beds:        { type: Number, required: true },
  baths:       { type: Number, required: true },
  sqft:        { type: String },
  listingMode: { type: String, enum: ['buy', 'rent'], default: 'buy' },
  status:      { type: String, enum: ['active', 'sold', 'deleted'], default: 'active' },
  files:       [fileAssetSchema]
}, { timestamps: true });

module.exports = mongoose.model('Listing', listingSchema);