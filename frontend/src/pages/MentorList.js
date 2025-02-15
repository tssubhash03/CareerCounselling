import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { motion } from "framer-motion";
const MentorList = () => {
  const [mentors, setMentors] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/mentors/all")
      .then((response) => response.json())
      .then((data) => setMentors(data))
      .catch((error) => console.error("Error fetching mentors:", error));
  }, []);

  const handleShowDetails = (mentor) => {
    setSelectedMentor(mentor);
    setShowModal(true);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#6C63FF", // Background color
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <motion.div
          initial={{ opacity: 0, y: 50 }} // Starts invisible and slightly below
          animate={{ opacity: 1, y: 0 }} // Moves to normal position
          transition={{ duration: 0.6, ease: "easeOut" }} // Smooth transition
        >
          <div className="container">
        <h2 className="text-center text-white mb-4">Mentor List</h2>
        
        {/* Mentor Cards */}
        <div className="row row-gap-4">
          {mentors.map((mentor) => (
            <div className="col-md-4 d-flex justify-content-center" key={mentor._id}>
              <div
                className="card p-3 shadow"
                style={{
                  borderRadius: "10px",
                  backgroundColor: "white",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                  width: "100%",
                  maxWidth: "350px",
                }}
              >
                <h5 className="text-center">{mentor.name}</h5>
                <p><strong>Expertise:</strong> {mentor.expertise}</p>
                <p><strong>Experience:</strong> {mentor.experience} years</p>
                
                {/* Buttons Row */}
                <div className="row justify-content-center gap-2">
                  <Button
                    variant="primary"
                    className="col-5"
                    onClick={() => handleShowDetails(mentor)}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="success"
                    className="col-5"
                    onClick={() => window.location.href = `/mentors/${mentor._id}`}
                  >
                    Full Profile
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
        </motion.div>

      {/* Modal for Mentor Details */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedMentor?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Specialization:</strong> {selectedMentor?.expertise}</p>
          <p><strong>Email:</strong> {selectedMentor?.email}</p>
          <p><strong>Experience:</strong> {selectedMentor?.experience} years</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MentorList;
