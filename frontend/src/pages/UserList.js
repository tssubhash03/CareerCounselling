import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState(""); // To store the role
  const navigate = useNavigate(); // For navigation

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
            Role: decodedToken?.role, // Send the role in headers (optional)
          },
        });
        setUsers(response.data);
        console.log("Users", response.data);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };

    fetchUsers();
  }, []);

  const handleChat = async (userId) => {
    try {
      const mentorId = JSON.parse(localStorage.getItem("userInfo"))._id;
      const token = localStorage.getItem("token");
      // Check if a chat room already exists between the mentor and the user
      const response = await axios.get(`http://localhost:5000/api/chat/room/${mentorId}/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data._id) {
        // If chat room exists, navigate to the existing chat room
        navigate(`/chat/${response.data._id}`);
      } else {
        // If no chat room exists, create a new one
        const newRoomResponse = await axios.post(
          "http://localhost:5000/api/chat/room",
          { user1: mentorId, user2: userId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        navigate(`/chat/${newRoomResponse.data._id}`);
      }
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>All Users</h2>
      <p>Logged in as: {role}</p> {/* Display role */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Interests</th>
            <th>Actions</th> {/* Add actions column */}
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
                  <button
                    className="btn btn-primary"
                    onClick={() => handleChat(user._id)} // Chat with the user
                  >
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
