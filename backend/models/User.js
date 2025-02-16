const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    interests: [{ type: String, required: true }], // Example: ["AI", "Cybersecurity"]
    profilePic: { type: String, default: "" }, // Profile picture URL
    about: { type: String, default: "" },
    isMentor: { type: Boolean, default: false }, // Short bio added
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
