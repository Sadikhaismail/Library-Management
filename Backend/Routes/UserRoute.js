// Routes/userRoutes.js
const express = require('express');
const { registerUser, loginUser, getUserProfile } = require('../Controllers/UserController');
const { protect } = require('../Middleware/AuthMiddleware'); // Ensure the user is authenticated

const router = express.Router();

// User registration, login, and profile routes
router.post('/users/register', registerUser); // Register user
router.post('/users/login', loginUser); // Login user
router.get('/users/profile', protect, getUserProfile); // Get profile of logged-in user (protected)

module.exports = router;
