Awesome! Now, let’s implement **user authentication (signup & login)** with **password hashing** and **JWT (JSON Web Token) authentication**.

---

## **🔷 Step 1: Install Required Packages**
Run this inside the **backend** folder:  
```bash
npm install bcryptjs jsonwebtoken express-async-handler
```
🔹 **bcryptjs** → Hashes passwords before storing them in the database.  
🔹 **jsonwebtoken (JWT)** → Creates secure tokens for user authentication.  
🔹 **express-async-handler** → Handles async errors in Express routes.  

---

## **🔷 Step 2: Create the `routes` Folder**
Inside the **backend** folder, create a new folder called `routes`.  
Then, inside `routes`, create a file called **`authRoutes.js`**.

📂 `backend/routes/`  
- **authRoutes.js** (Handles signup & login for users & mentors)

---

## **🔷 Step 3: Implement Authentication Routes**
📌 **File:** `backend/routes/authRoutes.js`
```js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Mentor = require("../models/Mentor");

const router = express.Router();

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// User Registration (Signup)
router.post("/signup", asyncHandler(async (req, res) => {
  const { name, email, password, role, interests, expertise, experience } = req.body;

  // Check if user/mentor exists
  const userExists = await User.findOne({ email });
  const mentorExists = await Mentor.findOne({ email });

  if (userExists || mentorExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  let newUser;
  if (role === "mentor") {
    newUser = await Mentor.create({
      name,
      email,
      password: hashedPassword,
      expertise,
      experience,
    });
  } else {
    newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      interests,
    });
  }

  if (newUser) {
    res.status(201).json({
      _id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role,
      token: generateToken(newUser.id, role),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
}));

// User Login
router.post("/login", asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  const mentor = await Mentor.findOne({ email });

  const account = user || mentor;

  if (account && (await bcrypt.compare(password, account.password))) {
    res.json({
      _id: account.id,
      name: account.name,
      email: account.email,
      role: user ? "student" : "mentor",
      token: generateToken(account.id, user ? "student" : "mentor"),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
}));

module.exports = router;
```

---

## **🔷 Step 4: Add Routes to `server.js`**
Now, we need to **connect these authentication routes** to our Express server.  

📌 **Modify `backend/server.js`**  
Add this below `app.use(cors());`  
```js
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
```

Now, your **final `server.js` file** should look like this:  
📌 **backend/server.js**
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

// Import Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

---

## **🔷 Step 5: Add JWT Secret Key in `.env`**
Open your `.env` file and add:
```
JWT_SECRET=your_secret_key_here
```
> 📝 Replace `your_secret_key_here` with a **strong random string**.

---

## **🔷 Step 6: Testing the API using Postman**
### ✅ **Signup a Student**
- **Method**: `POST`
- **URL**: `http://localhost:5000/api/auth/signup`
- **Body (JSON)**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456",
  "role": "student",
  "interests": ["AI", "Web Development"]
}
```
✅ **Response (Example)**:
```json
{
  "_id": "65a9f12b3c9a12345",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "student",
  "token": "eyJhbGciOiJIUzI1..."
}
```

---

### ✅ **Signup a Mentor**
- **Method**: `POST`
- **URL**: `http://localhost:5000/api/auth/signup`
- **Body (JSON)**:
```json
{
  "name": "Dr. Smith",
  "email": "smith@example.com",
  "password": "123456",
  "role": "mentor",
  "expertise": ["Cybersecurity", "Machine Learning"],
  "experience": 10
}
```
✅ **Response**:
```json
{
  "_id": "65a9f45a2a9b12345",
  "name": "Dr. Smith",
  "email": "smith@example.com",
  "role": "mentor",
  "token": "eyJhbGciOiJIUzI1..."
}
```

---

### ✅ **Login**
- **Method**: `POST`
- **URL**: `http://localhost:5000/api/auth/login`
- **Body (JSON)**:
```json
{
  "email": "john@example.com",
  "password": "123456"
}
```
✅ **Response**:
```json
{
  "_id": "65a9f12b3c9a12345",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "student",
  "token": "eyJhbGciOiJIUzI1..."
}
```

---

## **🎯 Summary**
✅ **Implemented user authentication** (Signup & Login).  
✅ **Used bcrypt.js for password hashing** (secure storage).  
✅ **Used JWT for authentication** (secure login system).  
✅ **Connected the routes in `server.js`**.  
✅ **Tested the API using Postman**.  

---

## **🚀 Next Steps**
Now, we need to:
1. **Protect Routes (Authorization Middleware)**
2. **Create Mentor Recommendation API**
3. **Start the Frontend (React)**

🔥 **Do you want to implement JWT Authorization next?** 😊