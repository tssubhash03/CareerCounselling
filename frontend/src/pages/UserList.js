import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const token = userInfo?.token;
        setRole(userInfo?.role);

        const response = await axios.get("http://localhost:5000/api/auth/users", {
          headers: {
            Authorization: `Bearer ${token}`,
            Role: userInfo?.role,
          },
        });

        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };

    fetchUsers();
  }, []);

  const handleChat = async (userId) => {
    try {
      const mentorData = JSON.parse(localStorage.getItem("userInfo"));
      const mentorId = mentorData._id;
      const token = localStorage.getItem("token");

      if (!mentorId || !userId) {
        console.error("Invalid mentor or user ID");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/chat/room",
        { user1: mentorId, user2: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate(`/chat/${response.data._id}`);
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#6C63FF",
        padding: "20px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ width: "100%", textAlign: "center", marginTop: "20px" }} // Properly centers the title
      >
        <h2 style={{ color: "white", marginBottom: "20px" }}>All Users</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center", marginTop: "20px" }}>
        {users.map((user) => (
          <div
            key={user._id}
            className="card"
            style={{
              width: "300px",
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
              textAlign: "center",
            }}
          >
            <h4>{user.name}</h4>
            <p>Email: {user.email}</p>
            <p>Interests: {user.interests?.join(", ") || "N/A"}</p>
            {role === "mentor" && (
              <button
                className="btn btn-primary"
                onClick={() => handleChat(user._id)}
                style={{ marginTop: "10px" }}
              >
                Chat with Student
              </button>
            )}
          </div>
        ))}
      </div>
      </motion.div>
    </div>
  );
};

export default UserList;
