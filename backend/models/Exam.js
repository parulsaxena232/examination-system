const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true } // Index (0,1,2,3)
});

const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  duration: { type: Number, required: true }, // in minutes
  totalMarks: { type: Number, required: true },
  formLink: { type: String }, // Optional Google Form link
  questions: [questionSchema]
}, { timestamps: true });

module.exports = mongoose.model('Exam', examSchema);
