const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Mentor = require("../models/Mentor");

const router = express.Router();

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// User Registration (Signup)
router.post("/signup", asyncHandler(async (req, res) => {
  const { name, email, password, role, interests, expertise, experience } = req.body;

  // Check if user/mentor exists
  const userExists = await User.findOne({ email });
  const mentorExists = await Mentor.findOne({ email });

  if (userExists || mentorExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  let newUser;
  if (role === "mentor") {
    newUser = await Mentor.create({
      name,
      email,
      password: hashedPassword,
      expertise,
      experience,
    });
  } else {
    newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      interests,
    });
  }

  if (newUser) {
    res.status(201).json({
      _id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role,
      token: generateToken(newUser.id, role),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
}));

// User Login
router.post("/login", asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  const mentor = await Mentor.findOne({ email });

  const account = user || mentor;

  if (account && (await bcrypt.compare(password, account.password))) {
    res.json({
      _id: account.id,
      name: account.name,
      email: account.email,
      role: user ? "student" : "mentor",
      token: generateToken(account.id, user ? "student" : "mentor"),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
}));

module.exports = router;
