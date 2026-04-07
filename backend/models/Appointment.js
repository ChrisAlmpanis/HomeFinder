const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  buyerID:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  listingID:   { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  scheduledAt: { type: Date, required: true },
  time:        { type: String, required: true },
  status:      { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);