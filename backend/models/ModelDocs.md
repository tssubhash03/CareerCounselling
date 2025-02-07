Great! Now, let's create the **User & Mentor models** in MongoDB.  

---

## **🔷 Step 1: Create the `models` Folder**
Inside your **backend** folder, create a new folder called **`models`**.  
Inside `models`, we will create two files:  

📂 `backend/models/`  
- **User.js** (for students)  
- **Mentor.js** (for mentors)  

---

## **🔷 Step 2: Create the User Model**  
📌 **File:** `backend/models/User.js`
```js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "admin"], default: "student" },
    interests: [{ type: String }], // User's career interests
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
```

### **🔹 Explanation**
1. **`name, email, password`** → Basic user details.  
2. **`role`** → Can be `"student"` or `"admin"` (for future management).  
3. **`interests`** → Stores user-selected career interests (e.g., AI, Web Dev).  
4. **`timestamps: true`** → Automatically adds `createdAt` and `updatedAt` fields.  

---

## **🔷 Step 3: Create the Mentor Model**  
📌 **File:** `backend/models/Mentor.js`
```js
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
```

### **🔹 Explanation**
1. **`name, email, password`** → Basic mentor details.  
2. **`expertise`** → Array of expertise fields (e.g., AI, Cybersecurity).  
3. **`experience`** → Number of years of experience.  
4. **`rating`** → Stores average mentor rating.  
5. **`reviews`** → Array where students can leave reviews.  

---

## **🔷 Step 4: Use Models in `server.js`**
Open your **`server.js`** file and add the models at the top:  

📌 **Modify `server.js`**
```js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// Import Models
const User = require("./models/User");
const Mentor = require("./models/Mentor");

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

---

## **✅ What’s Next?**
Now that we have the **User & Mentor models**, we need to:  
1. **Create authentication routes (signup & login)**  
2. **Implement password hashing & JWT authentication**  

🚀 **Shall we continue with authentication now?** 😊