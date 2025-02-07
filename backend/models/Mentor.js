const mongoose = require("mongoose");

const mentorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    expertise: [{ type: String }], // Areas of expertise
    experience: { type: Number, required: true }, // Years of experience
    rating: { type: Number, default: 0 }, // Average rating from students
    reviews: [{ studentId: mongoose.Schema.Types.ObjectId, review: String }],
  },
  { timestamps: true }
);

const Mentor = mongoose.model("Mentor", mentorSchema);

module.exports = Mentor;
