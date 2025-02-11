import React, { useState, useEffect, useRef } from "react";
import { Button, Container, Card, Image, InputGroup, FormControl } from "react-bootstrap";
import { FaPencilAlt, FaCopy } from "react-icons/fa";
import axios from "axios";
import AuthModal from "../components/AuthModal";

const Profile = () => {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState("");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

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

  return (
    <div style={{ backgroundColor: "#6C63FF", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Container className="d-flex justify-content-center">
        {user ? (
          <Card className="shadow-lg p-5 position-relative d-flex flex-row align-items-center" style={{ width: "100%", maxWidth: "1100px", borderRadius: "20px" }}>
            
            {/* Logout button in top-right corner */}
            <Button
              variant="danger"
              size="sm"
              className="position-absolute"
              style={{ top: "10px", right: "10px", borderRadius: "50%" }}
              onClick={handleLogout}
            >
              Logout
            </Button>

            {/* Profile Picture - Fixed Position */}
            <div className="position-relative" style={{ marginRight: "20px" }}>
              <Image
                src={`http://localhost:5000${profilePic}`}
                roundedCircle
                width={300}
                height={300}
                className="border border-3 border-white shadow profile-pic-hover"
              />
              
              {/* Upload & Edit Buttons below the profile pic */}
              <div className="mt-2 text-center">
                <Button variant="primary" size="sm" className="me-2 profile-btn-hover" onClick={handleUpload} style={{ borderRadius: "20px" }}>
                  Upload
                </Button>
                <Button variant="secondary" size="sm" className="profile-btn-hover" onClick={handleProfilePicClick} style={{ borderRadius: "20px" }}>
                  <FaPencilAlt />
                </Button>
                <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleProfilePicChange} />
              </div>
            </div>

            {/* User Info Section - Next to Profile Picture */}
            <div className="text-start" style={{ flex: 1 }}>
              {/* User Name */}
              <h2 style={{ fontSize: "2.5rem", fontWeight: "700", fontFamily: "'Poppins', sans-serif", marginBottom: "8px" }}>
                {user.name}
              </h2>

              {/* Email with Copy Button */}
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

              {/* User Additional Info */}
              <p style={{ fontSize: "1.1rem" }}>Role: {user.role}</p>
              {user.interests && <p style={{ fontSize: "1.1rem" }}>Interests: {user.interests}</p>}
              {user.expertise && <p style={{ fontSize: "1.1rem" }}>Expertise: {user.expertise}</p>}
            </div>
          </Card>
        ) : null}

        {/* Auth Modal is always open if user is not logged in */}
        <AuthModal show={showModal} handleClose={() => setShowModal(false)} />
      </Container>
    </div>
  );
};

export default Profile;
