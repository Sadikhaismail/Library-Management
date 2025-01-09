const express = require('express');
const { registerUser, loginUser, getUserProfile } = require('../Controllers/UserController');
const { protect } = require('../Middleware/AuthMiddleware'); 

const router = express.Router();

router.post('/users/register', registerUser); 
router.post('/users/login', loginUser); 
router.get('/users/profile', protect, getUserProfile); 

module.exports = router;
