import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing

const Home = () => {
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [showScrollButton, setShowScrollButton] = useState(false);
  const navigate = useNavigate(); // Initialize navigation hook

  useEffect(() => {
    const sections = document.querySelectorAll(".section");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          } else {
            setVisibleSections((prev) => {
              const newSet = new Set(prev);
              newSet.delete(entry.target.id);
              return newSet;
            });
          }
        });
      },
      { threshold: 0.4, rootMargin: "0px" }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  // Handle Scroll for "Back to Top" Button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to Top Function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to Career Counselling</h1>

      {content.map((item, index) => (
        <section
          key={index}
          id={`section-${index}`}
          className={`section ${visibleSections.has(`section-${index}`) ? "visible" : ""}`}
          style={styles.section}
        >
          <div style={styles.contentWrapper}>
            {/* Text Side */}
            <div style={{ ...styles.textSide, order: index % 2 === 0 ? 1 : 2 }}>
              <h2 style={styles.subheading}>{item.title}</h2>
              <p style={styles.paragraph}>{item.text}</p>

              {/* Login/Signup Button (Only for About Our Platform section) */}
              {index === 0 && (
                <button onClick={() => navigate("/profile")} style={styles.loginButton}>
                  Login / Sign Up
                </button>
              )}
            </div>

            {/* Image Side */}
            <div style={{ ...styles.imageSide, order: index % 2 === 0 ? 2 : 1 }}>
              <img src={item.image} alt={item.title} style={styles.image} />
            </div>
          </div>
        </section>
      ))}

      {/* Back to Top Button */}
      {showScrollButton && (
        <button onClick={scrollToTop} style={styles.scrollTopButton}>
          ↑ Back to Top
        </button>
      )}
    </div>
  );
};

// Content data (Ensure correct image paths)
const content = [
  {
    title: "About Our Platform",
    text: "Choosing the right career path is crucial. Our platform helps students and professionals navigate their career choices confidently with expert mentorship.",
    image: "/images/undraw_engineering-team_13ax.png",
  },
  {   
    title: "The Career Struggle",
    text: "Many students struggle to find careers that align with their skills and interests. Our mentors eliminate confusion by providing expert guidance.",
    image: "/images/undraw_learning-sketchingsh.png",
  },
  {
    title: "Who Can Benefit?",
    text: "School students, college students, and professionals looking for career advice can benefit from this platform.",
    image: "/images/undraw_books_2j5v.png",
  },
  {
    title: "Our Vision",
    text: "We believe every student deserves the right guidance. Our goal is to create a mentorship-driven ecosystem to help students succeed.",
    image: "/images/undraw_professor_d7zn.png",
  },
  {
    title: "Join Us on This Journey!",
    text: "Whether you're a student seeking direction or a professional willing to share knowledge, this platform is for you. Let's shape the future together!",
    image: "/images/undraw_in-the-zone_07y7.png",
  },
];

// Styles
const styles = {
  container: {
    maxWidth: "100%",
    margin: "0",
    padding: "50px 0",
    fontFamily: "'Ubuntu', sans-serif",
    lineHeight: "1.8",
    color: "#333",
  },
  heading: {
    textAlign: "center",
    color: "#2C3E50",
    fontSize: "2.5rem",
    marginBottom: "40px",
  },
  subheading: {
    color: "#34495E",
    fontSize: "1.8rem",
    marginBottom: "10px",
  },
  section: {
    minHeight: "75vh",
    display: "flex",
    justifyContent: "center",
    padding: "40px 20px",
    opacity: 0,
    transform: "translateY(50px)",
    transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
    width: "100%",
  },
  contentWrapper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    width: "100%",
    margin: "0 auto",
  },
  textSide: {
    flex: "1 1 45%",
    padding: "20px",
    margin: "0",
  },
  imageSide: {
    flex: "1 1 45%",
    padding: "20px",
    display: "flex",
    justifyContent: "center",
    margin: "0",
  },
  image: {
    width: "100%",
    height: "auto",
    borderRadius: "8px",
  },
  paragraph: {
    fontSize: "1.5rem",
    textAlign: "left",
    maxWidth: "750px",
  },
  loginButton: {
    backgroundColor: "#6C63FF",
    color: "#fff",
    padding: "12px 20px",
    fontSize: "1rem",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "15px",
    transition: "background 0.3s",
  },
  loginButtonHover: {
    backgroundColor: "#574eef",
  },
  scrollTopButton: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    backgroundColor: "#2C3E50",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "opacity 0.3s",
  },
};

// CSS for visibility transition
const css = `
  .section.visible {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
  .section:not(.visible) {
    opacity: 0 !important;
    transform: translateY(50px) !important;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = css;
document.head.appendChild(styleSheet);

export default Home;
