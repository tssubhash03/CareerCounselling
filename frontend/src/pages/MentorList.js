import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";

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
    <div className="container mt-4">
      <h2>Mentor List</h2>
      <div className="row">
        {mentors.map((mentor) => (
          <div className="col-md-4" key={mentor._id}>
            <div className="card p-3 shadow">
              <h5>{mentor.name}</h5>
              <p>{mentor.expertise}</p>
              <p>{mentor.experience}</p>
              <Button variant="primary" onClick={() => handleShowDetails(mentor)}>
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>

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
          <Button variant="primary" onClick={() => window.location.href = `/mentors/${selectedMentor?._id}`}>
            Full Details
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MentorList;
