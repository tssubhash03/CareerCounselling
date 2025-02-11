const mongoose = require("mongoose");

const mentorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    expertise: [{ type: String, required: true }], // Example: ["AI", "Cybersecurity"]
    experience: { type: Number, required: true }, // Years of experience
    about: { type: String, default: "" }, // Short bio (previously 'bio')
    profilePic: { type: String, default: "" }, // Profile picture URL
    videoLink: { type: String, default: "" }, // Mentor's introduction video link

    reviews: [
      {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, required: true, min: 1, max: 5 },
        review: { type: String, required: true },
      },
    ],

    rating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Function to calculate average rating
mentorSchema.methods.calculateRating = function () {
  if (this.reviews.length === 0) {
    this.rating = 0;
  } else {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating = (totalRating / this.reviews.length).toFixed(1);
  }
};

const Mentor = mongoose.model("Mentor", mentorSchema);
module.exports = Mentor;
