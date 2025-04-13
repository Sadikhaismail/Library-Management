const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../Models/AdminModel");

exports.registerAdmin = async (req, res) => {
  const { name, email, password, confirmPassword, adminKey } = req.body;

  if (!name || !email || !password || !confirmPassword || !adminKey) {
    return res.status(400).json({ message: "All fields are required including admin key" });
  }

  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ message: "Invalid admin key" });
  }

  if (!email.endsWith("@gmail.com")) {
    return res.status(400).json({ message: "Email must end with @gmail.com" });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters long" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    return res.status(400).json({ message: "Email already exists, try logging in" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newAdmin = new Admin({ name, email, password: hashedPassword });
  await newAdmin.save();
  res.status(201).json({ message: "Admin registered successfully" });
};





exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const admin = await Admin.findOne({ email });

  if (!admin) {
    return res.status(400).json({ message: "Email not registered" });
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Password is incorrect" });
  }

  const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: "7d" });


  res.json({ message: "Login successful", token }); // ✅ Send token to frontend

};

