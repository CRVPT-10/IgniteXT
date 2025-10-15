const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

// Routers
const usersRouter = require('./app_server/routes/users');
const materialRoutes = require('./app_server/routes/materialRoutes');

// Connect to MongoDB
mongoose.connect(
  'mongodb+srv://chunkupraney:Chunku@mongodb-practice.2caph.mongodb.net/ignitext?retryWrites=true&w=majority'
)
  .then(() => console.log('Mongoose connected to Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

const app = express();

// Middlewares
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({ origin: '*', credentials: true })); // allow all origins for Render
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Default route (for Render root URL)
app.get('/', (req, res) => {
  res.send('✅ Ignitext backend is live and running!');
});

// Routes
app.use('/api/users', usersRouter);
app.use('/api/materials', materialRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message });
});

// 🚫 DO NOT START THE SERVER HERE (Render runs bin/www)
module.exports = app;
