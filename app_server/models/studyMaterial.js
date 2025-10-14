const mongoose = require('mongoose');

const studyMaterialSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  fileUrl: { type: String, required: true },
  branch: { type: String, required: true },
  year: { type: String, required: true },
  subject: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StudyMaterial', studyMaterialSchema);
