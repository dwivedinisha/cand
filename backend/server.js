const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ CORS fix — allow your frontend Render URL
app.use(cors({
  origin: [
    'https://cand-1.onrender.com',      // your frontend
    'http://localhost:5173',              // local dev
    'http://localhost:3000',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// ✅ Handle preflight requests
app.options('*', cors());

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

app.use('/api/candidates', require('./routes/candidates'));
app.use('/api/match',      require('./routes/match'));
app.use('/api/ai',         require('./routes/ai'));

// ✅ Health check route
app.get('/', (req, res) => res.json({ status: 'API running' }));

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on port ${process.env.PORT || 5000}`));