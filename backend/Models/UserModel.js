const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required"] },
  email: { type: String, required: true, unique: true, match: [/.+@gmail\.com$/, "Invalid email format"] },
  password: { type: String, required: true, minlength: [8, "Password must be at least 8 characters"] },
});

// Prevent model overwrite
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
