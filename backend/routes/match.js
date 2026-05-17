const router = require('express').Router();
const Candidate = require('../models/Candidate');

router.post('/', async (req, res) => {
  const { requiredSkills, minExperience, preferredSkills = [] } = req.body;
  const candidates = await Candidate.find({ experience: { $gte: minExperience } });

  const ranked = candidates.map(c => {
    const req_matched = c.skills.filter(s =>
      requiredSkills.map(r => r.toLowerCase()).includes(s.toLowerCase())
    );
    const pref_matched = c.skills.filter(s =>
      preferredSkills.map(p => p.toLowerCase()).includes(s.toLowerCase())
    );
    const score = (req_matched.length / requiredSkills.length) * 100;
    return {
      ...c.toObject(),
      matchScore: Math.round(score),
      matchedSkills: req_matched,
      preferredMatched: pref_matched,
      tier: score >= 80 ? 'High' : score >= 50 ? 'Partial' : 'Low'
    };
  }).sort((a, b) => b.matchScore - a.matchScore);

  res.json(ranked);
});

module.exports = router;