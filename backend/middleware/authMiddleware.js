const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Mentor = require("../models/Mentor");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];
      console.log("Token:", token); 

      // Decode the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decoded); 

      // Attach user info to request
      req.user = await User.findById(decoded.id) || await Mentor.findById(decoded.id);

      // Check if the user is a mentor
      console.log("User role:", req.user.role);
      // if (req.headers.role !== 'mentor') {
      //   return res.status(403).json({ message: "Access denied. Only mentors can view users." });
      // }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, invalid token" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };
