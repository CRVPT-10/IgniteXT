const mongoose = require('mongoose');
const path = require('path'); // Import Node's path module
const Resource = require('../models/resource'); // <-- not mongoose.model('Resource') directly


// Existing function for uploading content
const contentUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ "message": "No file uploaded" });
  }
  if (!req.body.title || !req.body.subject) {
    return res.status(400).json({ "message": "Title and subject are required." });
  }

  const newResource = new Resource();
  newResource.title = req.body.title;
  newResource.subject = req.body.subject;
  newResource.resourceType = req.file.mimetype;
  newResource.fileName = req.file.filename;
  newResource.originalName = req.file.originalname;
  newResource.uploadedBy = req.auth._id;

  newResource.save((err, resource) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(201).json(resource);
    }
  });
};

// Existing function for listing all resources
const listResources = (req, res) => {
  Resource
    .find()
    .populate('uploadedBy', 'name')
    .exec((err, resources) => {
      if (err) {
        return res.status(404).json(err);
      }
      res.status(200).json(resources);
    });
};

// NEW function to get a single resource by its ID
const getResourceById = (req, res) => {
  Resource
    .findById(req.params.resourceid)
    .populate('uploadedBy', 'name')
    .exec((err, resource) => {
      if (!resource) {
        return res.status(404).json({ "message": "Resource not found" });
      } else if (err) {
        return res.status(404).json(err);
      }
      res.status(200).json(resource);
    });
};

// NEW function to handle file downloads
const downloadResource = (req, res) => {
  Resource
    .findById(req.params.resourceid)
    .exec((err, resource) => {
      if (!resource) {
        return res.status(404).json({ "message": "Resource not found" });
      } else if (err) {
        return res.status(404).json(err);
      }
      // Construct the file path
      const filePath = path.join(__dirname, '../../uploads', resource.fileName);
      // Use res.download to send the file
      res.download(filePath, resource.originalName, (err) => {
        if (err) {
          console.error("File download error:", err);
          res.status(500).json({ "message": "Could not download the file." });
        }
      });
    });
};

module.exports = {
  contentUpload,
  listResources,
  getResourceById,   // Export the new functions
  downloadResource
};

