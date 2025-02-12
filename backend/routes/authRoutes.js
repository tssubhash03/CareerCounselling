const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Mentor = require("../models/Mentor");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// User/Mentor Registration (Signup)
router.post(
  "/signup",
  asyncHandler(async (req, res) => {
    const { name, email, password, role, interests, expertise, experience, about, videoLink, profilePic } = req.body;

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
        about,
        videoLink,
        profilePic, // Store profile picture
      });
    } else {
      newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        interests,
        about,
        profilePic, // Store profile picture
      });
    }

    if (newUser) {
      res.status(201).json({
        _id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role,
        about: newUser.about,
        videoLink: newUser.videoLink,
        profilePic: newUser.profilePic, // Send profile picture in response
        token: generateToken(newUser.id, role),
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  })
);

// User/Mentor Login
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    const mentor = await Mentor.findOne({ email });

    const account = user || mentor;

    if (account && (await bcrypt.compare(password, account.password))) {
      const response = {
        _id: account.id,
        name: account.name,
        email: account.email,
        role: user ? "student" : "mentor",
        about: account.about,
        profilePic: account.profilePic, // Include profile picture in response
        token: generateToken(account.id, user ? "student" : "mentor"),
      };

      if (mentor) {
        response.videoLink = mentor.videoLink || ""; // Include videoLink for mentors
      }

      res.json(response);
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  })
);

// Get User/Mentor Profile
router.get(
  "/profile",
  protect,
  asyncHandler(async (req, res) => {
    res.json({
      _id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.expertise ? "mentor" : "student",
      interests: req.user.interests || [],
      expertise: req.user.expertise || [],
      about: req.user.about || "",
      profilePic: req.user.profilePic || "", // Include profile picture in profile response
    });
  })
);

module.exports = router;
