import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Card, Button, Spinner, Row, Col } from "react-bootstrap";
import { m, motion } from "framer-motion";

const MentorDetails = () => {
  const { id } = useParams(); // Get mentor ID from URL
  const navigate = useNavigate(); // For navigation
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/mentors/${id}`);
        setMentor(response.data);
      } catch (error) {
        console.error("Error fetching mentor details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMentor();
  }, [id]);

  // Function to extract YouTube Video ID
  const extractYouTubeID = (url) => {
    const regex = /(?:youtube\.com\/(?:.*v=|embed\/|v\/)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading mentor details...</p>
      </Container>
    );
  }

  if (!mentor) {
    return (
      <Container className="text-center mt-5">
        <p>Mentor not found!</p>
      </Container>
    );
  }
  const handleChat = async (mentorId) => {
    try {
        const userData = JSON.parse(localStorage.getItem("userInfo")); // Retrieve and parse user data
        const loggedInUserId = userData._id; // Extract only the user ID

        console.log("📌 Sending Chat Request with:");
        console.log("User1 (Logged in user):", loggedInUserId);
        console.log("User2 (Mentor):", mentorId);
      if (!loggedInUserId || !mentorId) {
        console.error("User not logged in!");
        return;
      }
      const response = await axios.post("http://localhost:5000/api/chat/room", {
        user1: loggedInUserId, // Replace with actual logged-in user ID
        user2: mentorId,
      });
  
      navigate(`/chat/${response.data._id}`);
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };
  return (
    <Container fluid className="mt-5 px-5">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Card className="p-4 shadow-lg" style={{ backgroundColor: "#6C63FF", borderRadius: "15px", color: "white" }}>
          <Row className="d-flex align-items-start">
            {/* Video Section */}
            <Col md={7} className="d-flex justify-content-center">
              {mentor.videoLink ? (
                <div className="w-100">
                  <div className="ratio ratio-16x9" style={{ borderRadius: "15px", overflow: "hidden" }}>
                    <iframe
                      width="100%"
                      height="400px"
                      src={`https://www.youtube.com/embed/${extractYouTubeID(mentor.videoLink)}`}
                      title="Mentor Introduction Video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              ) : (
                <p className="text-center">No introduction video available.</p>
              )}
            </Col>

            {/* Mentor Details Section */}
            <Col md={5}>
              <Card className="shadow-lg p-4" style={{ borderRadius: "15px", backgroundColor: "white", color: "black" }}>
                <Card.Body>
                  <Card.Title className="text-primary" style={{ fontSize: "1.8rem", fontWeight: "bold" }}>
                    {mentor.name}
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{mentor.specialization}</Card.Subtitle>
                  <Card.Text>
                    <strong>Email:</strong> {mentor.email} <br />
                    <strong>Experience:</strong> {mentor.experience} years <br />
                    <strong>Bio:</strong> {mentor.bio}
                  </Card.Text>
                  <Button variant="primary" href={`mailto:${mentor.email}?subject=Inquiry%20About%20Mentoring`}>
                    Contact Mentor
                  </Button>
                  &nbsp;
                  <Button variant="success" onClick={() => handleChat(mentor._id)}>
                    Chat with Mentor
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card>
      </motion.div>
    </Container>
  );
};

export default MentorDetails;
