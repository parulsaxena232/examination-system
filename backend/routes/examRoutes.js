const express = require('express');
const router = express.Router();
const Exam = require('../models/Exam');
const Result = require('../models/Result');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// ✅ Create a new exam
router.post('/create', verifyToken, isAdmin, async (req, res) => {
  const { title, subject, duration, totalMarks, questions, formLink } = req.body;
  try {
    const exam = new Exam({ title, subject, duration, totalMarks, questions, formLink });
    await exam.save();
    res.json({ message: "Exam created successfully" });
  } catch (err) {
    console.error("❌ Exam creation error:", err.message);
    res.status(500).json({ error: "Failed to create exam" });
  }
});

// ✅ Add question to an existing exam
router.post('/:id/add-question', verifyToken, isAdmin, async (req, res) => {
  const { question, options, correctAnswer } = req.body;
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ error: "Exam not found" });

   const correctIndex = Number.isInteger(correctAnswer) ? correctAnswer : parseInt(correctAnswer, 10);
   exam.questions.push({ questionText: question, options, correctAnswer: correctIndex });

    await exam.save();

    res.json({ message: "Question added successfully" });
  } catch (err) {
    console.error("❌ Add question error:", err.message);
    res.status(500).json({ error: "Failed to add question" });
  }
});

// ✅ Get all exams
router.get('/', verifyToken, async (req, res) => {
  try {
    const exams = await Exam.find();
    res.json(exams);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch exams" });
  }
});

// ✅ Get single exam
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ error: "Exam not found" });
    res.json(exam);
  } catch (err) {
    res.status(500).json({ error: "Error fetching exam" });
  }
});

// ✅ Update an existing exam
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { title, subject, duration, totalMarks, questions, formLink } = req.body;
    const updateRaw = { title, subject, duration, totalMarks, questions, formLink };
    const update = Object.fromEntries(Object.entries(updateRaw).filter(([, v]) => v !== undefined));
    const exam = await Exam.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!exam) return res.status(404).json({ error: "Exam not found" });
    res.json({ message: "Exam updated successfully", exam });
  } catch (err) {
    console.error("❌ Update exam error:", err.message);
    res.status(500).json({ error: "Failed to update exam" });
  }
});

// ✅ Delete an exam
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const deleted = await Exam.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Exam not found" });
    res.json({ message: "Exam deleted successfully" });
  } catch (err) {
    console.error("❌ Delete exam error:", err.message);
    res.status(500).json({ error: "Failed to delete exam" });
  }
});

// ✅ Get all results (admin only)
router.get('/results/all', verifyToken, isAdmin, async (req, res) => {
  try {
    const results = await Result.find().populate('examId userId');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch student results" });
  }
});

module.exports = router;
