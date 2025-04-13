const express = require("express");
const { register, login, getUserProfile } = require("../Controllers/UserController");
const { protect } = require("../Middleware/AuthMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, getUserProfile);

module.exports = router;
