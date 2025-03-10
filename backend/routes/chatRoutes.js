const express = require("express");
const mongoose = require("mongoose");
const ChatRoom = require("../models/ChatRoom");
const Message = require("../models/Message");
const User = require("../models/User");  // ✅ Added missing import
const Mentor = require("../models/Mentor"); // ✅ Added missing import

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
  const { roomId, senderId, senderType, text } = req.body;

  console.table(req.body); // ✅ Improved debugging

  try {
    if (!mongoose.Types.ObjectId.isValid(roomId) || !mongoose.Types.ObjectId.isValid(senderId)) {
      return res.status(400).json({ error: "Invalid chatRoom or sender ID format" });
    }

    // Validate senderType
    if (!["User", "Mentor"].includes(senderType)) {
      return res.status(400).json({ error: "Invalid senderType. Must be 'User' or 'Mentor'" });
    }

    const message = new Message({
      chatRoom: new mongoose.Types.ObjectId(roomId),
      sender: new mongoose.Types.ObjectId(senderId),
      senderType,
      text
    });

    await message.save();

    res.status(201).json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get All Messages in a Chat Room (Optimized)
router.get("/messages/:roomId", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.roomId)) {
      return res.status(400).json({ error: "Invalid chat room ID format" });
    }

    const messages = await Message.aggregate([
      { $match: { chatRoom: new mongoose.Types.ObjectId(req.params.roomId) } },
      { $sort: { createdAt: 1 } },
      {
        $lookup: {
          from: "users",
          localField: "sender",
          foreignField: "_id",
          as: "userSender"
        }
      },
      {
        $lookup: {
          from: "mentors",
          localField: "sender",
          foreignField: "_id",
          as: "mentorSender"
        }
      },
      {
        $project: {
          chatRoom: 1,
          senderType: 1,
          text: 1,
          createdAt: 1,
          sender: {
            $cond: {
              if: { $eq: ["$senderType", "User"] },
              then: { $arrayElemAt: ["$userSender", 0] },
              else: { $arrayElemAt: ["$mentorSender", 0] }
            }
          }
        }
      }
    ]);

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
``