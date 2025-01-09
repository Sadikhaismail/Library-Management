const User = require('../Models/UserModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Register new user
// Register new user with admin validation
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, isAdmin, adminKey } = req.body;

    // If admin registration is requested, validate the admin key
    if (isAdmin) {
      const expectedAdminKey = process.env.ADMIN_KEY;  // Read from the environment variable
      if (adminKey !== expectedAdminKey) {
        return res.status(401).json({ message: 'Invalid Admin Key' });
      }
    }

    // Proceed with user registration if no issues
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, isAdmin });

    if (user) {
      res.status(201).json({
        id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),  // Generate a JWT token for authentication
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Login user
// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password, adminKey } = req.body;

    const user = await User.findOne({ email });

    // If user is attempting admin login, validate the admin key
    if (user && user.isAdmin && adminKey !== process.env.ADMIN_KEY) {
      return res.status(401).json({ message: 'Invalid Admin Key' });
    }

    // Check if the user exists and the password matches
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Get User Profile
exports.getUserProfile = async (req, res) => {
  try {
    // Get the logged-in user's data from `req.user` (set by the `protect` middleware)
    const user = await User.findById(req.user.id).select('-password'); // Exclude password from the result

    if (user) {
      res.status(200).json({
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin || false, // Include additional fields if needed
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Middleware for protected routes
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized' });
    }
  } else {
    res.status(401).json({ message: 'No token provided' });
  }
};

// Admin middleware
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Admins only' });
  }
};
