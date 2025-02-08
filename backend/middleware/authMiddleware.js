const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Mentor = require("../models/Mentor");
const asyncHandler = require("express-async-handler");

// Middleware to protect routes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Extract token
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if user is a student or mentor
      req.user = (await User.findById(decoded.id)) || (await Mentor.findById(decoded.id));

      if (!req.user) {
        res.status(401);
        throw new Error("User not found");
      }
      console.log("Authenticated User found: ", req.user);
      next(); // Move to the next middleware
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, invalid token");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

// Middleware to check if the user is a mentor
const mentorOnly = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.expertise) {
    next();
  } else {
    res.status(403);
    throw new Error("Access denied. Only mentors can access this route.");
  }
});

module.exports = { protect, mentorOnly };
