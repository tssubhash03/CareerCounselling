import { Link, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";

const Navbar = () => {
  const [userInfo, setUserInfo] = useState(null);
  const location = useLocation(); // Get current page route
  const [activePage, setActivePage] = useState(location.pathname);

  useEffect(() => {
    setActivePage(location.pathname); // Update active page on route change
  }, [location.pathname]);

  return (
    <nav style={styles.navbar}>
      <h2 style={styles.logo}>Career Compass</h2>
      <ul style={styles.navLinks}>
        {[
          { path: "/", label: "Home" },
          { path: "/mentors", label: "Mentor List" },
          userInfo?.role === "mentor"
            ? { path: "/userlist", label: "Users" }
            : { path: "/recommend", label: "Mentor Recommendation" },
          { path: "/profile", label: "Profile" },
        ].map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              style={{
                ...styles.link,
                ...(activePage === item.path ? styles.activeLink : {}),
              }}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: "15px 25px", // Increased padding for a slightly extended look
    height: "70px", // Extended height
    color: "black",
    boxShadow: "0 4px 15px rgba(108, 99, 255, 0.4)", // Smooth dark purple shadow
    position: "fixed", // Keeps it fixed at the top
    width: "100%",
    top: 0,
    left: 0,
    zIndex: 1000,
  },
  logo: {
    margin: 0,
    cursor: "pointer",
    fontSize: "22px",
    fontWeight: "bold",
  },
  navLinks: {
    listStyle: "none",
    display: "flex",
    gap: "20px",
    margin: 0,
    padding: 0,
  },
  link: {
    color: "black",
    textDecoration: "none",
    fontSize: "16px",
    padding: "10px 15px", // Slightly increased padding for better spacing
    borderRadius: "30px",
    transition: "all 0.3s ease-in-out",
    cursor: "pointer",
  },
  activeLink: {
    backgroundColor: "#6C63FF",
    color: "white",
    transform: "scale(1.1)",
    boxShadow: "0 6px 12px rgba(108, 99, 255, 0.5)", // Soft glowing effect
  },
};

export default Navbar;
