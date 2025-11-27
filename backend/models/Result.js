const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  score: { type: Number, required: true },
  total: { type: Number, required: true }
}, {
  timestamps: true  // ✅ Adds createdAt and updatedAt fields automatically
});

module.exports = mongoose.model('Result', resultSchema);
