import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert, Row, Col } from "react-bootstrap";
import axios from "axios";

const AuthModal = ({ show, handleClose }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    interestedField: "", // Only for students
    expertise: "", // Only for mentors
    role: "student",
    about: "",
    videoLink: "", // Only for mentors
    experience: "", // Experience field added (Only for mentors)
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!show) {
      // Reset form data when modal is closed
      setFormData({
        name: "",
        email: "",
        password: "",
        interestedField: "", // Only for students
        expertise: "", // Only for mentors
        role: "student",
        about: "",
        videoLink: "",
        experience: "",
      });
      setError(""); // Clear any errors
      setIsSignup(false); // Reset to Login page on modal close
    }
  }, [show]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    try {
      const config = { headers: { "Content-Type": "application/json" } };
  
      let requestData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        about: formData.about,
        profilePic: formData.profilePic,
      };
  
      if (formData.role === "student") {
        requestData.interests = formData.interestedField || ""; // 🔥 Ensure data is sent
      } else if (formData.role === "mentor") {
        requestData.expertise = formData.expertise || ""; // 🔥 Ensure data is sent
        requestData.experience = formData.experience || "";
        requestData.videoLink = formData.videoLink || "";
      }
  
      let response;
      if (isSignup) {
        response = await axios.post("http://localhost:5000/api/auth/signup", requestData, config);
      } else {
        response = await axios.post("http://localhost:5000/api/auth/login", {
          email: formData.email,
          password: formData.password,
        }, config);
      }
  
      localStorage.setItem("userInfo", JSON.stringify(response.data));
      window.dispatchEvent(new Event("storage"));
      handleClose();
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("userInfo");
    // Close modal and set the state to show the login form
    handleClose();
    setIsSignup(false); // Ensure login page is shown after logout
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Body>
        <Row className="g-0">
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
                  
                  {/* Conditionally render based on role */}
                  {formData.role === "student" ? (
                    <Form.Group className="mb-3">
                      <Form.Label>Interested Field(Separate with ,)</Form.Label>
                      <Form.Control
                        type="text"
                        name="interestedField"
                        placeholder="Enter your field of interest"
                        value={formData.interestedField}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  ) : (
                    <Form.Group className="mb-3">
                      <Form.Label>Expertise(Separate with ,)</Form.Label>
                      <Form.Control
                        type="text"
                        name="expertise"
                        placeholder="Enter your field of expertise"
                        value={formData.expertise}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  )}

                  

                  {/* About Field */}
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

                  {/* Experience Field for Mentors */}
                  {formData.role === "mentor" && (
                    <Form.Group className="mb-3">
                      <Form.Label>Experience (Years)</Form.Label>
                      <Form.Control
                        type="number"
                        name="experience"
                        placeholder="Enter your years of experience"
                        value={formData.experience}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  )}

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
