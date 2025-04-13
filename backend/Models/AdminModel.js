const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required"] },
  email: { type: String, required: true, unique: true, match: [/.+@gmail\.com$/, "Invalid email format"] },
  password: { type: String, required: true, minlength: [8, "Password must be at least 8 characters"] },
  isAdmin: { type: Boolean, default: false }, 
}, { timestamps: true });  // ❌ Removed extra curly brace

// Prevent model overwrite
const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);

module.exports = Admin;
