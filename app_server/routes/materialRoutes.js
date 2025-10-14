const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const StudyMaterial = require('../models/studyMaterial'); // Make sure this model exists

// Serve uploads folder as static (add this in your main app.js too)
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --------------------
// Multer setup for file uploads
// --------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Upload folder
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// --------------------
// Upload study material (Faculty only)
// --------------------
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { branch, year, subject, uploadedBy } = req.body;

    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const newMaterial = new StudyMaterial({
      filename: req.file.originalname,
      fileUrl: `/uploads/${req.file.filename}`, // Relative URL
      branch,
      year,
      subject,
      uploadedBy,
      uploadedAt: new Date()
    });

    await newMaterial.save();
    res.status(201).json({ message: 'File uploaded successfully', material: newMaterial });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Upload failed' });
  }
});

// --------------------
// Get materials by branch, year, subject
// --------------------
router.get('/', async (req, res) => {
  try {
    const { branch, year, subject } = req.query;
    const query = {};
    if (branch) query.branch = branch;
    if (year) query.year = year;
    if (subject) query.subject = subject;

    const materials = await StudyMaterial.find(query);
    res.json(materials);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch materials' });
  }
});

// --------------------
// Download file by ID
// --------------------
router.get('/download/:id', async (req, res) => {
  try {
    const material = await StudyMaterial.findById(req.params.id);
    if (!material) return res.status(404).json({ message: 'File not found' });

    const filePath = path.join(process.cwd(), material.fileUrl); 
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File does not exist on server' });
    }

    res.download(filePath, material.filename);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;
