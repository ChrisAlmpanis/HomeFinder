const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  email:         { type: String, required: true, unique: true },
  passwordHash:  { type: String, required: true },
  role:          { type: String, enum: ['buyer', 'seller', 'admin'], required: true },
  isApproved:    { type: Boolean, default: false },
  agencyName:    { type: String },
  licenseNumber: { type: String },
  savedListings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);