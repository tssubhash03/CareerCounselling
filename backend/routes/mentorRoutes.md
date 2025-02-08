Here's the **final full implementation** of the **Mentor Recommendation API**, including:

✅ **Mentor Model** (with expertise, reviews, and rating calculation)  
✅ **Mentor Routes** (Recommendation & Reviews)  
✅ **Server Setup** (Connecting Mentor Routes)  

---

### 1️⃣ **Mentor Model** (`backend/models/Mentor.js`)

```javascript
const mongoose = require("mongoose");

const mentorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    expertise: [{ type: String, required: true }], // Example: ["Cybersecurity", "AI"]
    experience: { type: Number, required: true }, // Years of experience

    // Reviews (Array of objects: studentId, rating, and review text)
    reviews: [
      {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, required: true, min: 1, max: 5 },
        review: { type: String, required: true }
      }
    ],

    rating: { type: Number, default: 0 } // Average rating
  },
  { timestamps: true }
);

// Function to calculate the average rating
mentorSchema.methods.calculateRating = function () {
  if (this.reviews.length === 0) {
    this.rating = 0;
  } else {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating = (totalRating / this.reviews.length).toFixed(1); // Rounded to 1 decimal
  }
};

const Mentor = mongoose.model("Mentor", mentorSchema);
module.exports = Mentor;
```

---

### 2️⃣ **Mentor Routes** (`backend/routes/mentorRoutes.js`)

```javascript
const express = require("express");
const router = express.Router();
const Mentor = require("../models/Mentor");
const { protect } = require("../middleware/authMiddleware");
const asyncHandler = require("express-async-handler");

// 🔹 API: Get Recommended Mentors Based on Student Interests
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
```

---

### 3️⃣ **Connect Routes in Server** (`backend/server.js`)

Add this line to **server.js** after `authRoutes`:

```javascript
const mentorRoutes = require("./routes/mentorRoutes");
app.use("/api/mentors", mentorRoutes);
```

---

### 4️⃣ **Test the APIs** (Postman or Frontend)

#### **📌 Get Recommended Mentors**
🔹 **Method:** `GET`  
🔹 **URL:** `http://localhost:5000/api/mentors/recommend`  
🔹 **Headers:**
```makefile
Authorization: Bearer student_jwt_token
```
🔹 **Example Response:**
```json
[
  {
    "_id": "65a9f12b3c9a12345",
    "name": "Dr. Smith",
    "email": "smith@example.com",
    "expertise": ["AI", "Cybersecurity"],
    "experience": 10,
    "reviews": 20,
    "rating": 4.8
  },
  {
    "_id": "65a9f45a2a9b12346",
    "name": "John Doe",
    "email": "john@example.com",
    "expertise": ["Cybersecurity"],
    "experience": 5,
    "reviews": 12,
    "rating": 4.5
  }
]
```

#### **📌 Add a Review**
🔹 **Method:** `POST`  
🔹 **URL:** `http://localhost:5000/api/mentors/MENTOR_ID/review`  
🔹 **Headers:**
```makefile
Authorization: Bearer student_jwt_token
Content-Type: application/json
```
🔹 **Body (JSON):**
```json
{
  "rating": 5,
  "review": "Great mentor! Helped me a lot."
}
```
🔹 **Example Response:**
```json
{
  "message": "Review added successfully",
  "mentor": {
    "_id": "65a9f12b3c9a12345",
    "name": "Dr. Smith",
    "email": "smith@example.com",
    "expertise": ["AI", "Cybersecurity"],
    "experience": 10,
    "reviews": [
      {
        "studentId": "65a9e23b3c9a67890",
        "rating": 5,
        "review": "Great mentor! Helped me a lot."
      }
    ],
    "rating": 5
  }
}
```

---

### 🎯 **Next Steps**
✅ Backend API is ready! Now, you can:

🔹 **Build Frontend UI to Display Mentor Recommendations (React)**  
🔹 **Implement Peer-to-Peer Chat (Student ↔ Mentor)**  

Which one do you want to work on next? 😃🚀