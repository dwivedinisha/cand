// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// app.use(cors());
// app.use(express.json());


// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.error(err));

// app.use('/api/candidates', require('./routes/candidates'));
// app.use('/api/match',      require('./routes/match'));
// app.use('/api/ai',         require('./routes/ai'));

// const path = require("path");
// // Serve frontend build files
// app.use(express.static(path.join(__dirname, "../frontend/dist")));
// // React Router fix
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
// });

// app.listen(process.env.PORT || 5000, () =>
//   console.log(`Server running on port ${process.env.PORT}`));

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// API Routes
app.use('/api/candidates', require('./routes/candidates'));
app.use('/api/match', require('./routes/match'));
app.use('/api/ai', require('./routes/ai'));

// Serve Frontend
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// React Router Fix
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});