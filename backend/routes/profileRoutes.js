const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Mentor = require("../models/Mentor");
const { protect } = require("../middleware/authMiddleware");
const asyncHandler = require("express-async-handler");

// 🔹 Get Student Profile
router.get("/user", protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json(user);
}));

// 🔹 Get Mentor Profile
router.get("/mentor/:id", asyncHandler(async (req, res) => {
  const mentor = await Mentor.findById(req.params.id).select("-password");
  if (!mentor) {
    res.status(404);
    throw new Error("Mentor not found");
  }
  res.json(mentor);
}));

// 🔹 Update User Profile
router.put("/user", protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.name = req.body.name || user.name;
  user.interests = req.body.interests || user.interests;
  user.profilePic = req.body.profilePic || user.profilePic;

  const updatedUser = await user.save();
  res.json(updatedUser);
}));

// 🔹 Update Mentor Profile
router.put("/mentor/:id", protect, asyncHandler(async (req, res) => {
  const mentor = await Mentor.findById(req.params.id);
  if (!mentor) {
    res.status(404);
    throw new Error("Mentor not found");
  }

  mentor.name = req.body.name || mentor.name;
  mentor.expertise = req.body.expertise || mentor.expertise;
  mentor.experience = req.body.experience || mentor.experience;
  mentor.bio = req.body.bio || mentor.bio;
  mentor.profilePic = req.body.profilePic || mentor.profilePic;

  const updatedMentor = await mentor.save();
  res.json(updatedMentor);
}));

module.exports = router;
