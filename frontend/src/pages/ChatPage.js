import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

const ChatPage = () => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
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
        setMessages(response.data || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    if (storedUser) {
      setUser(storedUser);
    }

    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [roomId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const senderId = user?._id;
      const senderType = user?.role === "student" ? "User" : "Mentor";

      const response = await axios.post(
        "http://localhost:5000/api/chat/message",
        { roomId, senderId, senderType, text: newMessage },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages([...messages, response.data]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#6C63FF",
        padding: "20px",
      }}
    >
      <div
        className="card"
        style={{
          width: "500px",
          maxWidth: "90%",
          padding: "20px",
          backgroundColor: "white",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
        }}
      >
        <h2 className="text-center" style={{ marginBottom: "20px" }}>Chat Room</h2>
        <div
          className="chat-box"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            maxHeight: "400px",
            overflowY: "auto",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          {messages.length > 0 ? (
            messages.map((msg, index) => {
              const isMyMessage = msg.sender._id === user?._id;
              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: isMyMessage ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: isMyMessage ? "#d1f7c4" : "#f1f1f1",
                      padding: "10px",
                      borderRadius: "10px",
                      maxWidth: "60%",
                      wordWrap: "break-word",
                      display: "inline-block",
                    }}
                  >
                    <strong>{isMyMessage ? "You" : msg.sender.name || "Unknown"}:</strong>{" "}
                    {msg.text}
                  </div>
                </div>
              );
            })
          ) : (
            <p>No messages yet.</p>
          )}
        </div>
        <div className="chat-input" style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
          <input
            type="text"
            className="form-control"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <button
            className="btn btn-primary"
            onClick={sendMessage}
            style={{
              padding: "10px 20px",
              borderRadius: "5px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatPage;
