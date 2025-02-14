const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const Message = require("./models/Message");  
const connectDB = require("./config/db");

const http = require("http");
const { Server } = require("socket.io");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const mongoose = require("mongoose");
io.on("connection", (socket) => {
  console.log("🔵 A user connected:", socket.id);

  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`👥 User joined room: ${room}`);
  });

  // Assuming this is where the message is saved in the database:
// Assuming you're emitting a message after saving it to the database
socket.on("sendMessage", async (messageData) => {
  try {
    // Save the message to the database (MongoDB)
    const message = new Message(messageData); // assuming Message is your message model
    await message.save();

    // Emit the message to all clients in the room (both user and mentor)
    io.to(messageData.chatRoom).emit("receiveMessage", message); // Broadcast to the room
  } catch (error) {
    console.error("Error in sending message:", error);
  }
});

});
const chatRoutes = require("./routes/chatRoutes");
app.use("/api/chat", chatRoutes);
// Import Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const profileRoutes = require("./routes/profileRoutes");
app.use("/api/profile", profileRoutes);

app.use("/uploads", express.static("uploads"));

const mentorRoutes = require("./routes/mentorRoutes");
app.use("/api/mentors", mentorRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
