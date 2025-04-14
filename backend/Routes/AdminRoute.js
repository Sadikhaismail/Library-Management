const express = require("express");
const { registerAdmin, loginAdmin } = require("../Controllers/AdminController");

const router = express.Router();
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
 
module.exports = router;
 