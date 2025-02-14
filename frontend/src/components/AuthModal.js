import React, { useState } from "react";
import { Modal, Button, Form, Alert, Row, Col } from "react-bootstrap";
import axios from "axios";

const AuthModal = ({ show, handleClose }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    interestedField: "",
    role: "student",
    about: "",
    videoLink: "", // Only for mentors
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const config = { headers: { "Content-Type": "application/json" } };

      let response;
      if (isSignup) {
        response = await axios.post("http://localhost:5000/api/auth/signup", formData, config);
      } else {
        response = await axios.post("http://localhost:5000/api/auth/login", {
          email: formData.email,
          password: formData.password,
        }, config);
        console.log("Login Response:", response.data); // Debugging response

    localStorage.setItem("token", response.data.token);
    console.log("Token stored:", localStorage.getItem("token")); // Debugging token storage
      }

      console.log("Response:", response.data);
      localStorage.setItem("userInfo", JSON.stringify(response.data));
      window.dispatchEvent(new Event("storage")); // Notify all components to update

      handleClose();
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Body>
        <Row className="g-0">
          {/* Left Side: Form */}
          <Col md={6} className="p-4 d-flex flex-column justify-content-center">
            <h4 className="text-center mb-3">{isSignup ? "Sign Up" : "Login"}</h4>
            
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              {isSignup && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Interested Field</Form.Label>
                    <Form.Control
                      type="text"
                      name="interestedField"
                      placeholder="Enter your field of interest"
                      value={formData.interestedField}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Role</Form.Label>
                    <Form.Select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                    >
                      <option value="student">Student</option>
                      <option value="mentor">Mentor</option>
                    </Form.Select>
                  </Form.Group>

                  {/* About Field for Both Users and Mentors */}
                  <Form.Group className="mb-3">
                    <Form.Label>About</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="about"
                      placeholder="Tell us about yourself"
                      value={formData.about}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  {/* Video Link Field (Only for Mentors) */}
                  {formData.role === "mentor" && (
                    <Form.Group className="mb-3">
                      <Form.Label>Video Link</Form.Label>
                      <Form.Control
                        type="text"
                        name="videoLink"
                        placeholder="Enter your introduction video link"
                        value={formData.videoLink}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  )}
                </>
              )}

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Button color="primary" style={{ backgroundColor: '#6C63FF' }} type="submit" className="w-100" disabled={loading}>
                {loading ? "Processing..." : isSignup ? "Sign Up" : "Login"}
              </Button>
            </Form>

            <div className="text-center mt-3">
              {isSignup ? (
                <p>
                  Already have an account?{" "}
                  <span style={{ color: "purple", cursor: "pointer" }} onClick={() => setIsSignup(false)}>
                    Login
                  </span>
                </p>
              ) : (
                <p>
                  Don't have an account?{" "}
                  <span style={{ color: "purple", cursor: "pointer" }} onClick={() => setIsSignup(true)}>
                    Sign Up
                  </span>
                </p>
              )}
            </div>
          </Col>

          {/* Right Side: Illustration */}
          <Col md={6} className="d-none d-md-block">
            <div className="h-100 d-flex align-items-center justify-content-center">
              <img
                src="/images/undraw_authentication_tbfc (2).png"
                alt="Login Illustration"
                className="img-fluid"
                style={{ maxHeight: "400px" }}
              />
            </div>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default AuthModal;
