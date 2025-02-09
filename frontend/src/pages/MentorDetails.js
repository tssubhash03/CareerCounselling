import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Card, Button, Spinner } from "react-bootstrap";

const MentorDetails = () => {
  const { id } = useParams(); // Get mentor ID from URL
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

  return (
    <Container className="mt-5">
      <Card className="shadow-lg p-4">
        <Card.Body>
          <Card.Title className="text-primary">{mentor.name}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{mentor.specialization}</Card.Subtitle>
          <Card.Text>
            <strong>Email:</strong> {mentor.email} <br />
            <strong>Experience:</strong> {mentor.experience} years <br />
            <strong>Bio:</strong> {mentor.bio}
          </Card.Text>
          <Button variant="primary" href={`mailto:${mentor.email}?subject=Inquiry%20About%20Mentoring`}>
            Contact Mentor
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default MentorDetails;
