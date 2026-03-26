const mongoose = require('mongoose');

const ConversionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  originalFileName: { type: String, required: true },
  format: { type: String, required: true },
  fileUrl: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
}, { timestamps: true });

module.exports = mongoose.model('Conversion', ConversionSchema);
