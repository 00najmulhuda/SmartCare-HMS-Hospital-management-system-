// models/Feedback.js
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  name: { type: String, default: 'Anonymous' },
  message: { type: String, required: true },
  category: { type: String, enum: ['Good', 'Average', 'Issue/Complaint'], required: true },
  keywords: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
