import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const ChatPage = () => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    socket.emit("joinRoom", roomId);
    console.log("🚀 Sending message to room:", roomId);

    axios.get(`http://localhost:5000/api/chat/messages/${roomId}`).then((res) => {
      setMessages(res.data);
    });

    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [roomId]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const userData = JSON.parse(localStorage.getItem("userInfo"));
    if (!userData || !userData._id) {
      console.error("❌ User is not logged in!");
      return;
    }

    const messageData = {
      chatRoom: roomId,
      sender: userData._id, // Replace with logged-in user ID
      text: newMessage,
    };

    axios.post("http://localhost:5000/api/chat/message", messageData);
    socket.emit("sendMessage", messageData);
    setNewMessage("");
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender === "USER_ID" ? "my-message" : "other-message"}>
            <strong>{msg.sender.name}: </strong>
            {msg.text}
          </div>
        ))}
      </div>
      <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatPage;
