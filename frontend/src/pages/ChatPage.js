import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const ChatPage = () => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userId, setUserId] = useState(""); // Logged-in user ID
  const messagesEndRef = useRef(null);

  // Join the room and fetch initial messages on component mount
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userInfo"));
    if (userData && userData._id) {
      setUserId(userData._id);
    }

    // Emit joinRoom event to join the chat room
    socket.emit("joinRoom", roomId);

    // Fetch initial messages from the backend (server)
    axios.get(`http://localhost:5000/api/chat/messages/${roomId}`).then((res) => {
      setMessages(res.data);
    });

    // Listen for incoming messages via socket (for both user and mentor)
    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]); // Add new message to state
    });

    // Cleanup socket event listener when the component is unmounted
    return () => {
      socket.off("receiveMessage");
    };
  }, [roomId]); // Dependency on roomId ensures effect runs on room change

  // Scroll to the bottom of the chat when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      chatRoom: roomId,
      sender: userId,
      text: newMessage,
      timestamp: new Date().toISOString(),
    };

    // Send the message to the backend
    await axios.post("http://localhost:5000/api/chat/message", messageData);
    
    // Emit the message through socket to notify others (mentor and user)
    socket.emit("sendMessage", messageData);
    
    setNewMessage(""); // Reset the input field
  };

  return (
    <div style={styles.chatContainer}>
      {/* Messages */}
      <div style={styles.messages}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.messageBubble,
              ...(msg.sender === userId ? styles.myMessage : styles.otherMessage),
            }}
          >
            <strong>{msg.sender === userId ? "You" : msg.sender.name}</strong>
            <p>{msg.text}</p>
            <span style={styles.timestamp}>{new Date(msg.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div style={styles.chatInput}>
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          style={styles.inputBox}
        />
        <button onClick={sendMessage} style={styles.sendButton}>
          Send
        </button>
      </div>
    </div>
  );
};

const styles = {
  chatContainer: {
    display: "flex",
    flexDirection: "column",
    height: "90vh",
    width: "100%",
    maxWidth: "600px",
    margin: "auto",
    border: "1px solid #ddd",
    borderRadius: "10px",
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "10px",
  },
  messageBubble: {
    maxWidth: "75%",
    padding: "10px",
    margin: "5px",
    borderRadius: "10px",
    wordWrap: "break-word",
  },
  myMessage: {
    backgroundColor: "#25d366", // WhatsApp green
    color: "white",
    alignSelf: "flex-end",
    textAlign: "right",
  },
  otherMessage: {
    backgroundColor: "#ececec",
    color: "black",
    alignSelf: "flex-start",
    textAlign: "left",
  },
  timestamp: {
    fontSize: "0.8rem",
    color: "gray",
    textAlign: "right",
    display: "block",
    marginTop: "3px",
  },
  chatInput: {
    display: "flex",
    padding: "10px",
    background: "white",
    borderTop: "1px solid #ddd",
  },
  inputBox: {
    flex: 1,
    padding: "10px",
    border: "none",
    borderRadius: "20px",
    outline: "none",
  },
  sendButton: {
    marginLeft: "10px",
    padding: "10px 15px",
    backgroundColor: "#128c7e",
    color: "white",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
  },
};

export default ChatPage;
