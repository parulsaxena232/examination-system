const express = require('express');
const router = express.Router();
const Result = require('../models/Result');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// ✅ Submit result (any logged-in user)
router.post('/submit', verifyToken, async (req, res) => {
  const { userId, examId, score, total } = req.body;
  try {
    const result = new Result({ userId, examId, score, total });
    await result.save();
    res.json({ message: "Result stored" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save result" });
  }
});

// ✅ Get results of a specific user (student dashboard)
router.get('/user/:userId', verifyToken, async (req, res) => {
  try {
    const results = await Result.find({ userId: req.params.userId })
      .populate('examId', 'title') // include exam title for student view
      .sort({ createdAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch results" });
  }
});

// ✅ Get all results (admin only)
router.get('/all', verifyToken, isAdmin, async (req, res) => {
  try {
    const results = await Result.find()
      .populate('userId', 'name email')   // Get user details
      .populate('examId', 'title')        // Get exam title
      .sort({ createdAt: -1 });           // Latest first
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch all results" });
  }
});

module.exports = router;

// ✅ Public leaderboard (top results)
router.get('/leaderboard', async (req, res) => {
  try {
    const results = await Result.find()
      .populate('userId', 'name')
      .populate('examId', 'title')
      .sort({ score: -1, createdAt: -1 })
      .limit(50);

    const data = results.map(r => ({
      studentName: r.userId?.name || 'Unknown',
      examTitle: r.examId?.title || 'Unknown',
      score: r.score,
      total: r.total,
      createdAt: r.createdAt
    }));

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});
