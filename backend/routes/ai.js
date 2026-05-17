const router = require('express').Router();
const axios  = require('axios');
const Candidate = require('../models/Candidate');

router.post('/shortlist', async (req, res) => {
  const { requiredSkills, minExperience, preferredSkills = [] } = req.body;

  const candidates = await Candidate.find({ experience: { $gte: minExperience } });
  if (!candidates.length) return res.json([]);

  const candidateList = candidates.map((c, i) =>
    `${i + 1}. ${c.name} | Skills: ${c.skills.join(', ')} | Experience: ${c.experience} years`
  ).join('\n');

  const prompt = `
You are a technical recruiter. Rank these candidates for a role requiring:
- Required skills: ${requiredSkills.join(', ')}
- Preferred skills: ${preferredSkills.join(', ')}
- Minimum experience: ${minExperience} years

Candidates:
${candidateList}

Respond ONLY in valid JSON array format like this:
[
  { "rank": 1, "name": "...", "score": 92, "reason": "..." },
  ...
]
No extra text, just the JSON array.`;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const text = response.data.choices[0].message.content;
    const clean = text.replace(/```json|```/g, '').trim();
    const ranked = JSON.parse(clean);
    res.json(ranked);
  } catch (err) {
    res.status(500).json({ error: 'AI ranking failed', details: err.message });
  }
});

module.exports = router;