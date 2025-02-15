const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    chatRoom: { type: mongoose.Schema.Types.ObjectId, ref: "ChatRoom", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, required: true }, // Can be a User or Mentor
    senderType: { type: String, enum: ["User", "Mentor"], required: true }, // Identifies sender type
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;
