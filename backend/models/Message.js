const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderID:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  listingID:  { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' },
  content:    { type: String, required: true },
  isRead:     { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);