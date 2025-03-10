import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Card, Button, Spinner, Row, Col, Form } from "react-bootstrap";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
const MentorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  const extractYouTubeID = (url) => {
    const regex = /(?:youtube\.com\/(?:.*v=|embed\/|v\/)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const submitReview = async () => {
    if (!review.trim()) return alert("Review cannot be empty!");
    
    setSubmitting(true);
    try {
      const userData = JSON.parse(localStorage.getItem("userInfo"));
      const token = userData.token;
      
      await axios.post(
        `http://localhost:5000/api/mentors/${id}/review`,
        { rating, review },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Review submitted successfully!");
      const response = await axios.get(`http://localhost:5000/api/mentors/${id}`);
      setMentor(response.data);
      setReview("");
      setRating(5);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review.");
    }
    setSubmitting(false);
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
      const userData = JSON.parse(localStorage.getItem("userInfo"));
      const loggedInUserId = userData._id;

      if (!loggedInUserId || !mentorId) {
        console.error("User not logged in!");
        return;
      }
      const response = await axios.post("http://localhost:5000/api/chat/room", {
        user1: loggedInUserId,
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
                    {mentor.experience && (
              <div style={{
                marginTop: "10px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 12px",
                backgroundColor: "#e3f2fd", // Light blue background
                color: "#0d47a1", // Dark blue text
                fontWeight: "bold",
                fontSize: "1rem",
                borderRadius: "8px",
                width: "fit-content",
              }}>
                <Briefcase size={20} /> {/* Work/Experience icon */}
                {mentor.experience} Years of Experience
              </div>
            )} <br />
                    {mentor.about && (
                  <div
                    style={{
                      backgroundColor: "#f0f0f0", // Light grey background
                      padding: "10px",
                      borderRadius: "10px", // Rounded corners
                      fontSize: "1.1rem",
                      marginTop: "10px",
                    }}
                  >
                    <strong>About:</strong> {mentor.about}
                  </div>
                )}<br />
                    {mentor.expertise && mentor.expertise.length > 0 && (
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(2, auto)", // Ensures two items per row
                gap: "8px" 
              }}>
                {mentor.expertise.map((skill, index) => (
                  <div key={index} style={{
                    marginTop: "8px",
                    border: "2px solid lightblue",
                    padding: "5px 12px",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    backgroundColor: "#f0f8ff",
                    textAlign: "center"
                  }}>
                    {skill}
                  </div>
                ))}
              </div>
            )}
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

          {/* Reviews Section */}
          <Row className="mt-4">
            <Col md={12}>
              <Card className="shadow-lg p-4">
                <Card.Title className="text-dark">Reviews & Ratings</Card.Title>
                <div>
                  {mentor.reviews.length === 0 ? (
                    <p>No reviews yet. Be the first to review!</p>
                  ) : (
                    mentor.reviews.map((rev, index) => (
                      <Card key={index} className="mb-3 p-3">
                        <strong>{rev.reviewerRole.toUpperCase()}:</strong> {rev.review} - {rev.rating} ⭐
                      </Card>
                    ))
                  )}
                </div>

                {/* Review Form */}
                <Form className="mt-3">
                  <Form.Group>
                    <Form.Label>Rating:</Form.Label>
                    <Form.Control as="select" value={rating} onChange={(e) => setRating(e.target.value)}>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num} Stars
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>

                  <Form.Group className="mt-2">
                    <Form.Label>Write a Review:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      placeholder="Share your experience..."
                    />
                  </Form.Group>

                  <Button
                    className="mt-3"
                    variant="primary"
                    onClick={submitReview}
                    disabled={submitting}
                  >
                    {submitting ? "Submitting..." : "Submit Review"}
                  </Button>
                </Form>
              </Card>
            </Col>
          </Row>
        </Card>
      </motion.div>
    </Container>
  );
};

export default MentorDetails;
