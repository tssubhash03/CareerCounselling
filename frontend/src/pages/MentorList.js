import React, { useState, useEffect } from "react";
import { Badge, Button } from "react-bootstrap";
import { motion } from "framer-motion";

const MentorList = () => {
  const [mentors, setMentors] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/mentors/all")
      .then((response) => response.json())
      .then((data) => setMentors(data))
      .catch((error) => console.error("Error fetching mentors:", error));
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f4f9",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container">
          <h2 className="text-center text-dark mb-4">Mentor List</h2>

          <div className="row row-gap-4">
            {mentors.map((mentor) => (
              <div className="col-md-4 d-flex justify-content-center" key={mentor._id}>
                <motion.div
                  className="card text-center shadow mentor-card"
                  style={{
                    borderRadius: "15px",
                    backgroundColor: "white",
                    boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
                    width: "100%",
                    maxWidth: "350px",
                    overflow: "hidden",
                    position: "relative",
                    cursor: "pointer",
                    transition: "transform 0.2s ease-in-out",
                  }}
                  whileHover={{ scale: 1.05 }} // Pop-up effect on hover
                >
                  {/* Profile Picture */}
                  <div
                    style={{
                      width: "100%",
                      height: "280px",
                      overflow: "hidden",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#ddd",
                    }}
                  >
                    <img
                      src={mentor.profilePic.startsWith("http") ? mentor.profilePic : `http://localhost:5000${mentor.profilePic}`}
                      alt={mentor.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  {/* Mentor Details - Positioned as relative to allow absolute button placement */}
                  <div className="p-3" style={{ position: "relative" }}>
                    <h5 className="mt-2">{mentor.name}</h5>

                    {/* Display Expertise as Badges */}
                    <div className="mb-2">
                      {mentor.expertise.length > 0 ? (
                        mentor.expertise.map((skill, index) => (
                          <Badge bg="primary" className="me-1" key={index}>
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <Badge bg="secondary">No Expertise</Badge>
                      )}
                    </div>

                    <p className="mb-1">
                      <strong>Experience:</strong> {mentor.experience} years
                    </p>

                    {/* View Profile Button - Covers the content area when hovered */}
                    <Button
                      variant="success"
                      className="mentor-btn"
                      style={{
                        backgroundColor: "rgba(40, 167, 69, 0.9)", // 90% opacity green
                        border: "none",
                        padding: "12px",
                        fontSize: "16px",
                        transition: "opacity 0.3s ease-in-out",
                        position: "absolute",
                        top: "0",
                        left: "0",
                        width: "100%",
                        height: "100%",
                        opacity: 0, // Initially hidden
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        borderRadius: "0", // No rounded corners
                      }}
                      onMouseEnter={(e) => (e.target.style.opacity = "1")}
                      onMouseLeave={(e) => (e.target.style.opacity = "0")}
                      onClick={() => window.location.href = `/mentors/${mentor._id}`}
                    >
                      View Profile
                    </Button>

                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MentorList;
