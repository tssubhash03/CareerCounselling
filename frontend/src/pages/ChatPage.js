import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ChatPage = () => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]); // Ensure messages is always an array
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:5000/api/chat/messages/${roomId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessages(response.data || []); // Ensure messages is always an array
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    // Fetch user info
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    if (storedUser) {
      setUser(storedUser);
    }

    // Optional: Polling for real-time updates every 5 seconds (if no WebSocket)
    const interval = setInterval(fetchMessages, 5000);

    return () => clearInterval(interval);
  }, [roomId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const senderId = user?._id; // Ensure user is set

      const response = await axios.post(
        "http://localhost:5000/api/chat/message",
        { roomId, senderId, text: newMessage },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages([...messages, response.data]); // Update messages
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Chat Room</h2>
      <div className="chat-box">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={index} className={msg.sender === user?._id ? "my-message" : "other-message"}>
              <strong>{msg.senderName || "Unknown"}:</strong> {msg.text}
            </div>
          ))
        ) : (
          <p>No messages yet.</p>
        )}
      </div>

      <div className="chat-input">
        <input
          type="text"
          className="form-control"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button className="btn btn-primary mt-2" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
