const jwt = require('jsonwebtoken');
const User = require('../Models/UserModel');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultSecretKey');

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(404).json({ message: 'User not found' });
      }

      next();
    } catch (error) {
      console.error('Token Verification Error:', error.message);
      return res.status(401).json({ message: `Not authorized, ${error.message}` });
    }
  } else {
    console.error('Authorization header missing or malformed');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};