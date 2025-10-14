const mongoose = require('mongoose');

mongoose.connect(
  'mongodb+srv://chunkupraney:Chunku@mongodb-practice.2caph.mongodb.net/ignitext?retryWrites=true&w=majority'
)
.then(() => console.log('Mongoose connected to Atlas'))
.catch(err => console.error('MongoDB connection error:', err));
module.exports = mongoose;
