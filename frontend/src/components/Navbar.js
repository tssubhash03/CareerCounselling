import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";

const Navbar = () => {
  const [userInfo, setUserInfo] = useState(null);

  // Fetch user info from localStorage when the component mounts
  useEffect(() => {
    const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUserInfo(storedUserInfo);
  }, []); // Empty dependency array ensures this runs only once when component mounts

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUserInfo(null); // Clear state after logout
  };

  return (
    <nav style={styles.navbar}>
      <h2 style={styles.logo}>Career Counselling</h2>
      <ul style={styles.navLinks}>
        <li><Link to="/" style={styles.link}>Home</Link></li>
        <li><Link to="/mentors" style={styles.link}>Mentor List</Link></li>

        {/* Show "Users" for Mentors, Hide "Mentor Recommendation" for Students */}
        {userInfo && userInfo.role === "mentor" ? (
          <li><Link to="/userlist" style={styles.link}>Users</Link></li>
        ) : (
          <li><Link to="/recommend" style={styles.link}>Mentor Recommendation</Link></li>
        )}

        <li><Link to="/profile" style={styles.link}>Profile</Link></li>

        {/* Add a logout button */}
        {userInfo && (
          <li>
            <button onClick={handleLogout} style={styles.link}>Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#333",
    padding: "10px 20px",
    color: "white"
  },
  logo: { margin: 0 },
  navLinks: {
    listStyle: "none",
    display: "flex",
    gap: "20px",
    margin: 0,
    padding: 0
  },
  link: { color: "white", textDecoration: "none", fontSize: "16px" }
};

export default Navbar;
