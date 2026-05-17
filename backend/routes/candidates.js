const router = require('express').Router();
const Candidate = require('../models/Candidate');

// Add candidate
router.post('/', async (req, res) => {
  try {
    const candidate = await Candidate.create(req.body);
    res.status(201).json(candidate);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all candidates
router.get('/', async (req, res) => {
  const candidates = await Candidate.find().sort({ createdAt: -1 });
  res.json(candidates);
});

// Delete candidate
router.delete('/:id', async (req, res) => {
  await Candidate.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;