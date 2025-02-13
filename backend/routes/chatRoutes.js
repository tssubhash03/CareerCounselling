const express = require("express");
const mongoose = require("mongoose"); 
const ChatRoom = require("../models/ChatRoom");
const Message = require("../models/Message");
const User = require("../models/User");

const router = express.Router();

// ✅ Create or Get an Existing Chat Room
router.post("/room", async (req, res) => {
  let { user1, user2 } = req.body; // ✅ Change `const` to `let`

  console.log("🔍 Received user1:", user1);
  console.log("🔍 Received user2:", user2);

  try {
    if (!mongoose.Types.ObjectId.isValid(user1) || !mongoose.Types.ObjectId.isValid(user2)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    user1 = new mongoose.Types.ObjectId(user1); // ✅ Now allowed
    user2 = new mongoose.Types.ObjectId(user2); // ✅ Now allowed

    let chatRoom = await ChatRoom.findOne({ users: { $all: [user1, user2] } });

    if (!chatRoom) {
      chatRoom = new ChatRoom({ users: [user1, user2] });
      await chatRoom.save();
    }

    res.status(200).json(chatRoom);
  } catch (error) {
    console.error("Error finding chat room:", error);
    res.status(500).json({ error: "Server error" });
  }
});


// ✅ Send a Message
router.post("/message", async (req, res) => {
  const { chatRoom, sender, text } = req.body;

  try {
    // Validate chatRoom and sender as valid ObjectIds
    if (!mongoose.Types.ObjectId.isValid(chatRoom) || !mongoose.Types.ObjectId.isValid(sender)) {
      return res.status(400).json({ error: "Invalid chatRoom or sender ID format" });
    }

    // Convert to ObjectId after validation
    const message = new Message({
      chatRoom: new mongoose.Types.ObjectId(chatRoom),
      sender: new mongoose.Types.ObjectId(sender),
      text
    });

    await message.save();

    res.status(201).json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get All Messages in a Chat Room
router.get("/messages/:roomId", async (req, res) => {
  try {
    const messages = await Message.find({ chatRoom: req.params.roomId })
      .sort({ createdAt: 1 })
      .populate("sender", "name");

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
