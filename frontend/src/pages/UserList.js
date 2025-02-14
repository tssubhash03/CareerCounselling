import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState(""); // Store mentor role
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token", token);

        // Decode token to get the role (optional)
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        setRole(decodedToken?.role); // Set the role to state
        console.log("Role", decodedToken?.role);

        const response = await axios.get("http://localhost:5000/api/auth/users", {
          headers: {
            Authorization: `Bearer ${token}`,
            Role: decodedToken?.role,
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

      // 🔹 Step 1: Call API to create/retrieve chat room
      const response = await axios.post(
        "http://localhost:5000/api/chat/room",
        { user1: mentorId, user2: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 🔹 Step 2: Navigate to the chat room with the retrieved room ID
      navigate(`/chat/${response.data._id}`);
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>All Users</h2>
      <p>Logged in as: {role}</p>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Interests</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.interests?.join(", ") || "N/A"}</td>
              <td>
                {role === "mentor" && (
                  <button className="btn btn-primary" onClick={() => handleChat(user._id)}>
                    Chat with Student
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
