const express = require('express');
const router = express.Router();
const { expressjwt: jwt } = require('express-jwt');
const multer = require('multer');
require('dotenv').config(); // Load .env

// Controllers
const ctrlAuth = require('../controllers/authentication');
const ctrlContent = require('../controllers/content');
const ctrlAuthorization = require('../controllers/authorization');
const StudyMaterial = require('../models/studyMaterial');



// Configure Multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop()
    );
  }
});
const upload = multer({ storage });

// JWT middleware
const auth = jwt({
  secret: process.env.JWT_SECRET || 'fallbackSecret', // fallback if .env not loaded
  algorithms: ['HS256'],
  requestProperty: 'auth'
}).unless({ path: ['/api/login', '/api/register'] }); // public routes

// Authentication routes (public)
router.post('/api/register', ctrlAuth.register);
router.post('/api/login', ctrlAuth.login);

// Resource routes (protected)
router.get('/api/resources', auth, ctrlContent.listResources);
router.get('/api/resources/:resourceid', auth, ctrlContent.getResourceById);
router.get('/api/resources/:resourceid/download', auth, ctrlContent.downloadResource);

// Upload route (protected + role-based)
router.post(
  '/api/upload',
  auth,
  ctrlAuthorization.isFaculty,
  upload.single('resourceFile'),
  ctrlContent.contentUpload
);

module.exports = router;
