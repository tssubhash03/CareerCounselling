const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

// 🔹 API: Fetch only normal users (exclude mentors)
router.get("/all", protect, async (req, res) => {
    try {
        if (req.user.role !== "mentor") {
            return res.status(403).json({ message: "Access denied. Only mentors can see users." });
        }

        // Fetch users who are NOT mentors
        const users = await User.find({ role: "user" }); 

        if (users.length === 0) {
            return res.status(404).json({ message: "No users found." });
        }

        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
