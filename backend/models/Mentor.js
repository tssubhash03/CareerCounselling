const mongoose = require("mongoose");

const mentorSchema = new mongoose.Schema({
  name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  expertise: [String],
  experience: { type: Number, required: true }, 
  about: { type: String, default: "" },
  profilePic: { type: String, default: "" }, // Profile picture URL
  videoLink: { type: String, default: "" },
  rating: { type: Number, default: 0 },
  reviews: [
    {
      reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Stores user/mentor ID
      reviewerRole: { type: String, enum: ["user", "mentor"], required: true }, // Role of reviewer
      rating: { type: Number, required: true },
      review: { type: String, required: true },
    },
  ],
});

// Function to recalculate average rating
mentorSchema.methods.calculateRating = function () {
  if (this.reviews.length === 0) {
    this.rating = 0;
  } else {
    this.rating =
      this.reviews.reduce((acc, item) => acc + item.rating, 0) / this.reviews.length;
  }
  return this.rating;
};

const Mentor = mongoose.model("Mentor", mentorSchema);
module.exports = Mentor;
