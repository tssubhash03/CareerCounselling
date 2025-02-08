Great! Now, let's implement **JWT Authorization Middleware** to protect routes so only **authenticated users** can access certain endpoints.

---

## **🔷 Step 1: Create `middleware` Folder**
Inside the **backend** folder, create a new folder called **`middleware`**.  
Then, inside `middleware`, create a file called **`authMiddleware.js`**.

📂 `backend/middleware/`  
- **authMiddleware.js** (Handles JWT authentication)

---

## **🔷 Step 2: Implement JWT Middleware**
📌 **File:** `backend/middleware/authMiddleware.js`
```js
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
```

---

## **🔷 Step 3: Protect an API Route**
Let's protect a **profile route** where users can see their details.

📌 **Modify `backend/routes/authRoutes.js`**
```js
const { protect } = require("../middleware/authMiddleware");

router.get("/profile", protect, asyncHandler(async (req, res) => {
  res.json({
    _id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.expertise ? "mentor" : "student",
    interests: req.user.interests || [],
    expertise: req.user.expertise || [],
  });
}));
```

---

## **🔷 Step 4: Test the Protected Route**
### ✅ **1️⃣ Without Token**
- **Method**: `GET`
- **URL**: `http://localhost:5000/api/auth/profile`
- **Headers**: (No token)

❌ **Response**:
```json
{
  "message": "Not authorized, no token"
}
```

---

### ✅ **2️⃣ With Valid Token**
- **Method**: `GET`
- **URL**: `http://localhost:5000/api/auth/profile`
- **Headers**:
  ```json
  {
    "Authorization": "Bearer your_jwt_token_here"
  }
  ```
- **Response (Example for Student)**:
```json
{
  "_id": "65a9f12b3c9a12345",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "student",
  "interests": ["AI", "Web Development"]
}
```
- **Response (Example for Mentor)**:
```json
{
  "_id": "65a9f45a2a9b12345",
  "name": "Dr. Smith",
  "email": "smith@example.com",
  "role": "mentor",
  "expertise": ["Cybersecurity", "Machine Learning"]
}
```

---

## **🔷 Step 5: Protect Mentor-Specific Routes**
Now, let's create a **mentor-only route** to update their profile.

📌 **Modify `backend/routes/authRoutes.js`**
```js
const { protect, mentorOnly } = require("../middleware/authMiddleware");

router.put("/mentor/update", protect, mentorOnly, asyncHandler(async (req, res) => {
  const { expertise, experience } = req.body;

  const mentor = await Mentor.findById(req.user.id);

  if (mentor) {
    mentor.expertise = expertise || mentor.expertise;
    mentor.experience = experience || mentor.experience;

    const updatedMentor = await mentor.save();
    res.json(updatedMentor);
  } else {
    res.status(404);
    throw new Error("Mentor not found");
  }
}));
```

---

## **🔷 Step 6: Test the Mentor Route**
### ✅ **1️⃣ Student Tries to Access**
- **Method**: `PUT`
- **URL**: `http://localhost:5000/api/auth/mentor/update`
- **Headers**:
  ```json
  {
    "Authorization": "Bearer student_jwt_token"
  }
  ```
❌ **Response**:
```json
{
  "message": "Access denied. Only mentors can access this route."
}
```

---

### ✅ **2️⃣ Mentor Updates Profile**
- **Method**: `PUT`
- **URL**: `http://localhost:5000/api/auth/mentor/update`
- **Headers**:
  ```json
  
    "Authorization": "Bearer mentor_jwt_token"
  ```
- **Body (JSON)**:
```json
{
  "expertise": ["AI", "Blockchain"],
  "experience": 12
}
```
✅ **Response**:
```json
{
  "_id": "65a9f45a2a9b12345",
  "name": "Dr. Smith",
  "email": "smith@example.com",
  "role": "mentor",
  "expertise": ["AI", "Blockchain"],
  "experience": 12
}
```

---

## **🎯 Summary**
✅ **Implemented JWT Authentication Middleware (`authMiddleware.js`)**  
✅ **Protected the Profile Route (`/api/auth/profile`)**  
✅ **Created a Mentor-Specific Route (`/api/auth/mentor/update`)**  
✅ **Tested the API with and without tokens**  

---

## **🚀 Next Steps**
Now, we need to:
1. **Build the Mentor Recommendation API**
2. **Start the Frontend (React)**
3. **Implement Chat Feature (Student ↔ Mentor)**

🔥 **Do you want to start with the Mentor Recommendation API next?** 😊