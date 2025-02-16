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
    console.log("Received Data:", req.body);

    const { 
      name, 
      email, 
      password, 
      role, 
      interests, 
      expertise, 
      experience, 
      about, 
      videoLink, 
      profilePic 
    } = req.body;

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
        expertise: expertise && typeof expertise === "string" 
          ? expertise.split(",").map(skill => skill.trim()) 
          : [],
        experience,
        about,
        videoLink,
        profilePic,
      });
    } else {
      newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        interests: interests && typeof interests === "string" 
          ? interests.split(",").map(field => field.trim()) 
          : [],
        about,
        profilePic,
      });
    }

    console.log("Stored Data:", newUser);

    if (newUser) {
      res.status(201).json({
        _id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role,
        about: newUser.about,
        interests: newUser.interests || [],
        expertise: newUser.expertise || [],
        experience: newUser.experience || 0,
        videoLink: newUser.videoLink || "",
        profilePic: newUser.profilePic,
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

    let account = user || mentor; 

    if (!account) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    if (!account.password) {
      return res.status(400).json({ message: "Password not found in DB" });
    }

    if (await bcrypt.compare(password, account.password)) {
      // Create response object
      const response = {
        _id: account.id,
        name: account.name,
        email: account.email,
        role: user ? "student" : "mentor",
        about: account.about || "",
        profilePic: account.profilePic || "",
        token: generateToken(account.id, user ? "student" : "mentor"),
      };

      // Include `interests` for students
      if (user) {
        response.interests = user.interests || [];
      }

      // Include `expertise` & `experience` for mentors
      if (mentor) {
        response.expertise = mentor.expertise || [];
        response.experience = mentor.experience || 0;
        response.videoLink = mentor.videoLink || "";
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
      profilePic: req.user.profilePic || "",
    });
  })
);

router.get("/users", protect, asyncHandler(async (req, res) => {
  console.log("User role:", req.headers.role);
  if (req.headers.role !== "mentor") {
    res.status(403);
    throw new Error("Access denied. Only mentors can view users.");
  }

  const users = await User.find({}, "name email interests");
  res.json(users);
}));

module.exports = router;
