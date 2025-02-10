import React, { useState, useEffect, useRef } from "react";
import { Button, Container, Card, Image } from "react-bootstrap";
import { FaPencilAlt } from "react-icons/fa"; 
import axios from "axios";
import AuthModal from "../components/AuthModal";

const Profile = () => {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState(""); 
  const [file, setFile] = useState(null); // Store the selected file
  const fileInputRef = useRef(null); // Reference to hidden file input

  useEffect(() => {
    const updateUser = () => {
      const storedUser = localStorage.getItem("userInfo");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setProfilePic(parsedUser.profilePic || "/default-avatar.png");
      } else {
        setUser(null);
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
  };

  const handleProfilePicClick = () => {
    fileInputRef.current.click(); // Open file picker
  };

  const handleProfilePicChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile); // Store selected file
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

  return (
    <Container className="mt-5">
      <Card className="p-4 shadow-lg text-center">
        {user ? (
          <>
            <div className="position-relative d-inline-block">
              <Image src={`http://localhost:5000${profilePic}`} roundedCircle width={120} height={120} />
              
              {/* Pencil Icon to open file explorer */}
              <FaPencilAlt
                className="position-absolute bottom-0 end-0 bg-light p-1 rounded-circle"
                style={{ cursor: "pointer" }}
                onClick={handleProfilePicClick}
              />
              
              {/* Hidden File Input */}
              <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleProfilePicChange} />
              
              {/* Upload Button to send the file to backend */}
              <button className="btn btn-primary mt-2" onClick={handleUpload}>
                Upload
              </button>
            </div>

            <h2 className="mt-3">{user.name}</h2>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
            {user.interests && <p>Interests: {user.interests}</p>}
            {user.expertise && <p>Expertise: {user.expertise}</p>}

            <Button variant="danger" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <h2>Login or Sign Up to View Profile</h2>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              Login / Sign Up
            </Button>
          </>
        )}
      </Card>

      <AuthModal show={showModal} handleClose={() => setShowModal(false)} />
    </Container>
  );
};

export default Profile;
