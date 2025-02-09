import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <h2 style={styles.logo}>Career Counselling</h2>
      <ul style={styles.navLinks}>
        <li><Link to="/" style={styles.link}>Home</Link></li>
        <li><Link to="/mentors" style={styles.link}>Mentor List</Link></li>
        <li><Link to="/recommend" style={styles.link}>Mentor Recommendation</Link></li>
        <li><Link to="/profile" style={styles.link}>Profile</Link></li>
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
