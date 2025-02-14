const express = require("express");
const mongoose = require("mongoose"); 
const ChatRoom = require("../models/ChatRoom");
const Message = require("../models/Message");

const router = express.Router();

// ✅ Create or Get an Existing Chat Room
router.post("/room", async (req, res) => {
  let { user1, user2 } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(user1) || !mongoose.Types.ObjectId.isValid(user2)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    user1 = new mongoose.Types.ObjectId(user1);
    user2 = new mongoose.Types.ObjectId(user2);

    let chatRoom = await ChatRoom.findOne({ users: { $all: [user1, user2] } });

    if (!chatRoom) {
      chatRoom = new ChatRoom({ users: [user1, user2] });
      await chatRoom.save();
    }

    res.status(200).json(chatRoom);
  } catch (error) {
    console.error("Error finding/creating chat room:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Send a Message
router.post("/message", async (req, res) => {
  const { roomId, senderId, text } = req.body;
    console.log("chatRoom", roomId);
    console.log("sender", senderId);
    console.log("text", text);
    console.log("Valid of chatRoom", mongoose.Types.ObjectId.isValid(roomId));
    console.log("Valid of sender", mongoose.Types.ObjectId.isValid(senderId));
  try {
    if (!mongoose.Types.ObjectId.isValid(roomId) || !mongoose.Types.ObjectId.isValid(senderId)) {
      return res.status(400).json({ error: "Invalid chatRoom or sender ID format" });
    }

    const message = new Message({
      chatRoom: new mongoose.Types.ObjectId(roomId),
      sender: new mongoose.Types.ObjectId(senderId),
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
