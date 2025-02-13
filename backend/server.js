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

  socket.on("sendMessage", async ({ chatRoom, sender, text }) => {
    const message = new Message({
      chatRoom: new mongoose.Types.ObjectId(chatRoom), 
      sender: new mongoose.Types.ObjectId(sender),  
      text
    });
    
    await message.save();

    io.to(chatRoom).emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("🔴 A user disconnected:", socket.id);
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

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
