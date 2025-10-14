// resource.js
const mongoose = require('./db');

const resourceSchema = new mongoose.Schema({
  title: String,
  description: String,
  fileUrl: String,
  uploadedBy: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resource', resourceSchema);
