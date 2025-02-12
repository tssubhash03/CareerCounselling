const express = require("express");
const router = express.Router();
const Mentor = require("../models/Mentor");
const { protect } = require("../middleware/authMiddleware");
const asyncHandler = require("express-async-handler");

// 🔹 API: Get Recommended Mentors Based on Student Interests
router.get("/all", async (req, res) => {
  try {
    const mentors = await Mentor.find(); // Fetch all mentors from DB
    res.status(200).json(mentors);
    
  } catch (error) {
    console.error("Error fetching mentors:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/recommend", protect, asyncHandler(async (req, res) => {
  if (!req.user.interests || req.user.interests.length === 0) {
    res.status(400);
    throw new Error("No interests found. Please update your profile.");
  }

  // Find mentors matching student interests, sorted by rating & reviews
  const mentors = await Mentor.find({
    expertise: { $in: req.user.interests }
  }).sort({ rating: -1, reviews: -1 });

  res.json(mentors);
}));

// Specific Mentor Details
router.get("/:id", async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id); // Find mentor by ID
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }
    res.json(mentor);
  } catch (error) {
    console.error("Error fetching mentor:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 API: Add a Review to a Mentor
router.post("/:id/review", protect, asyncHandler(async (req, res) => {
  const { rating, review } = req.body;
  const mentor = await Mentor.findById(req.params.id);

  if (!mentor) {
    res.status(404);
    throw new Error("Mentor not found");
  }

  // Check if the student has already reviewed this mentor
  const alreadyReviewed = mentor.reviews.find(
    (r) => r.studentId.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error("You have already reviewed this mentor.");
  }

  // Add new review
  mentor.reviews.push({
    studentId: req.user._id,
    rating: Number(rating),
    review
  });

  // ✅ Recalculate the average rating
  mentor.calculateRating();

  await mentor.save();
  res.json({ message: "Review added successfully", mentor });
}));

module.exports = router;
