const User = require('mongoose').model('User');

const isFaculty = (req, res, next) => {
  // We assume that the user object is available in req.auth from the previous JWT middleware
  if (req.auth && req.auth.role === 'faculty') {
    next(); // User is faculty, proceed to the next middleware/controller
  } else {
    // User is not authorized
    return res.status(403).json({ "message": "Forbidden: You must be a faculty member to perform this action." });
  }
};

module.exports = {
  isFaculty
};

