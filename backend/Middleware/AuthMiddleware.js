const jwt = require('jsonwebtoken');
const User = require('../Models/UserModel');
const Admin = require('../Models/AdminModel');

// Protect both user and admin
exports.protect = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) return res.status(401).json({ message: 'No token, not authorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Try finding user
    let user = await User.findById(decoded.id).select('-password');
    if (!user) {
      // If not user, try admin
      user = await Admin.findById(decoded.id).select('-password');
      if (!user) return res.status(401).json({ message: 'Not authorized' });
    }

    req.user = user;
    req.isAdmin = user instanceof Admin;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token failed' });
  }
};

// Admin-only middleware
exports.adminMiddleware = (req, res, next) => {
  if (req.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied, admin only' });
  }
};
