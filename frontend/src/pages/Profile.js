import React, { useState, useEffect, useRef } from "react";
import { Button, Container, Card, Image, InputGroup, FormControl } from "react-bootstrap";
import { FaPencilAlt, FaCopy } from "react-icons/fa";
import axios from "axios";
import AuthModal from "../components/AuthModal";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { Briefcase } from "lucide-react";

const Profile = () => {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState("");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [editingVideo, setEditingVideo] = useState(false);
  const [videoLink, setVideoLink] = useState("");
  const [modalDismissed, setModalDismissed] = useState(false);

  useEffect(() => {
    const updateUser = () => {
      const storedUser = localStorage.getItem("userInfo");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setProfilePic(parsedUser.profilePic || "/default-avatar.png");
      } else {
        setUser(null);
        setShowModal(true); // Open login/signup modal automatically
      }
    };

    updateUser();
    window.addEventListener("storage", updateUser);
    return () => {
      window.removeEventListener("storage", updateUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    setShowModal(true); // Show login/signup modal after logout
  };

  const handleProfilePicClick = () => {
    fileInputRef.current.click();
  };

  const handleProfilePicChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

   
    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const token = JSON.parse(localStorage.getItem("userInfo")).token;
      const { data } = await axios.put("http://localhost:5000/api/profile/upload-profile-pic", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setProfilePic(data.profilePic);
      const updatedUser = { ...user, profilePic: data.profilePic };
      setUser(updatedUser);
      localStorage.setItem("userInfo", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Profile picture upload failed:", error);
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(user.email);
    alert("Email copied!");
  };

  // Function to extract YouTube Video ID
  const extractYouTubeID = (url) => {
    const regex = /(?:youtube\.com\/(?:.*v=|embed\/|v\/)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };
  const handleVideoUpdate = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo")).token;
      const { data } = await axios.put(
        `http://localhost:5000/api/profile/mentor/${user._id}`,
        { videoLink },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser({ ...user, videoLink: data.videoLink });
      localStorage.setItem("userInfo", JSON.stringify({ ...user, videoLink: data.videoLink }));
      setEditingVideo(false);
    } catch (error) {
      console.error("Failed to update video link:", error);
    }
  };
  return (
    <div style={{ fontFamily: "'Ubuntu', sans-serif",backgroundColor: "#6C63FF", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Display the SVG background when no user is logged in */}
      {user === null && (
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            zIndex: "-1", // Position the SVG behind the modal
            backgroundImage: 'url("images/undraw_access-denied_krem.png")',
            backgroundSize: "cover",
            backgroundPosition: "center",
             // Adjust the opacity as needed
          }}
        />
      )}
      <Container className="d-flex justify-content-center">
        {user ? (
          <motion.div
          initial={{ opacity: 0, y: 50 }} // Starts invisible and slightly below
          animate={{ opacity: 1, y: 0 }} // Moves to normal position
          transition={{ duration: 0.6, ease: "easeOut" }} // Smooth transition
        >
          <Card className="shadow-lg p-5 position-relative d-flex align-items-start" style={{ width: "100%", maxWidth: "1100px", borderRadius: "20px", display: "flex", flexDirection: "row",marginTop:"50px" }}>
            
            {/* Logout button in top-right corner */}
            <Button
              variant="danger"
              size="sm"
              className="position-absolute"
              style={{ top: "10px", right: "10px", borderRadius: "20px" }}
              onClick={handleLogout}
            >
              Logout
            </Button>

            {/* Profile Picture */}
            <div className="position-relative" style={{ marginRight: "20px", flex: "0 0 200px" }}>
              <Image
                src={`http://localhost:5000${profilePic}`}
                roundedCircle
                width={300}
                height={300}
                className="border border-3 border-white shadow profile-pic-hover"
              />
              
              {/* Upload & Edit Buttons */}
              {/* Upload & Edit Buttons */}
            <div className="mt-2 text-center">
              <Button
                variant="primary"
                size="sm"
                className="me-2 profile-btn-hover"
                onClick={handleUpload}
                style={{ borderRadius: "20px" }}
              >
                Upload
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="profile-btn-hover"
                onClick={handleProfilePicClick}
                style={{ borderRadius: "20px" }}
              >
                <FaPencilAlt />
              </Button>
              <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleProfilePicChange} />

              {/* Display Average Rating in Gold Stars */}
              {user.role === "mentor" && (
                <div className="mt-3">
                  <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Rating:</span>
                  <div style={{ display: "inline-block", marginLeft: "8px" }}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <FaStar key={i} style={{ color: "#FFD700" }} />

                    ))}
                  </div>
                </div>
              )}
              {user.expertise && user.expertise.length > 0 && (
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(2, auto)", // Ensures two items per row
                gap: "8px" 
              }}>
                {user.expertise.map((skill, index) => (
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
            

            {user.experience && (
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
                {user.experience} Years of Experience
              </div>
            )}

            {user.interests && user.interests.length > 0 && (
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(2, auto)", // Two items per row
                gap: "8px" 
              }}>
                {user.interests.map((interest, index) => (
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
                    {interest}
                  </div>
                ))}
              </div>
            )}

            </div>
            </div>  

            {/* User Info Section */}
            <div className="text-start" style={{ flex: 1 }}>
              <h2 style={{ fontSize: "2.5rem", fontWeight: "700", fontFamily: "'Poppins', sans-serif", marginBottom: "8px" }}>
                {user.name}
              </h2>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <InputGroup className="mb-3" style={{ maxWidth: "400px" }}>
                  <FormControl
                    value={user.email}
                    readOnly
                    style={{ fontSize: "1.2rem", fontWeight: "400", backgroundColor: "#fff" }}
                  />
                  <Button variant="outline-secondary" onClick={handleCopyEmail}>
                    <FaCopy />
                  </Button>
                </InputGroup>

                <div
                  style={{
                    display: "inline-block",
                    border: "2px solid #90EE90", // Light green border
                    color: "#228B22", // Dark green text
                    backgroundColor: "#E6FFE6", // Light green background
                    padding: "5px 10px", // Adjusted padding
                    borderRadius: "12px", // Rounded corners
                    fontSize: "1rem",
                    fontWeight: "600",
                    marginTop: "10px",
                    whiteSpace: "nowrap", // Prevents unwanted spacing
                  }}
                >
                  Role: {user.role}
                </div>

                {/* {user.interests && <p style={{ fontSize: "1.1rem" }}>Interests: {user.interests.join(", ")}</p>}
                {user.expertise && <p style={{ fontSize: "1.1rem" }}>Expertise: {user.expertise}</p>} */}
                {user.about && (
                  <div
                    style={{
                      backgroundColor: "#f0f0f0", // Light grey background
                      padding: "10px",
                      borderRadius: "10px", // Rounded corners
                      fontSize: "1.1rem",
                      marginTop: "10px",
                    }}
                  >
                    <strong>About:</strong> {user.about}
                  </div>
                )}
                {/* Added About field */}
                
                {/* YouTube Video Section (Only for Mentors) */}
                {user.role === "mentor" && user.videoLink && (
                  <div className="mt-4">
                    <h4>Introduction Video</h4>
                    <div className="ratio ratio-16x9" style={{borderRadius: "30px", overflow : "hidden"}}>
                      <iframe
                        width="100%"
                        height="315"
                        src={`https://www.youtube.com/embed/${extractYouTubeID(user.videoLink)}`}
                        title="Mentor Introduction Video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div className="mt-3">
                    {editingVideo ? (
                      <InputGroup>
                        <FormControl
                          type="text"
                          placeholder="Enter YouTube video link"
                          value={videoLink}
                          onChange={(e) => setVideoLink(e.target.value)}
                        />
                        <Button variant="success" onClick={handleVideoUpdate}>Save</Button>
                        <Button variant="secondary" onClick={() => setEditingVideo(false)}>Cancel</Button>
                      </InputGroup>
                    ) : (
                      <Button variant="primary" onClick={() => setEditingVideo(true)}>Edit Video Link</Button>
                    )}
                  </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
        ) : null}

        {/* Auth Modal is always open if user is not logged in */}
        <AuthModal show={showModal} handleClose={() => setShowModal(false)} />
      </Container>
    </div>
  );
};

export default Profile;
