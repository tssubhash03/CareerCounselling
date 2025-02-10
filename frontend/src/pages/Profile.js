import React, { useState, useEffect } from "react";
import { Button, Container, Card } from "react-bootstrap";
import { FaPencilAlt } from "react-icons/fa";
import AuthModal from "../components/AuthModal";

const Profile = () => {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    const updateUser = () => {
      const storedUser = localStorage.getItem("userInfo");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setProfilePic(userData.profilePic || "/default-profile.png");
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

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePic(imageUrl);
      // Here, you should send the image to the backend for permanent storage
    }
  };

  return (
    <Container className="mt-5">
      <Card className="p-4 shadow-lg text-center">
        {user ? (
          <>
            <div className="position-relative d-inline-block">
              {/* Profile Image */}
              <img
                src={profilePic}
                alt="Profile"
                className="rounded-circle border"
                style={{ width: "120px", height: "120px", objectFit: "cover" }}
              />
              
              {/* Pencil Icon for Upload */}
              <label
                htmlFor="upload-input"
                className="position-absolute"
                style={{ bottom: 0, right: 0, cursor: "pointer" }}
              >
                <FaPencilAlt className="text-primary bg-white p-1 rounded-circle shadow" style={{ fontSize: "18px" }} />
              </label>
              <input
                type="file"
                id="upload-input"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleUpload}
              />
            </div>

            <h2 className="mt-3">{user.name}</h2>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
            {user.interests && <p>Interests: {user.interests}</p>}
            {user.expertise && <p>Expertise: {user.expertise}</p>}

            <div className="d-flex justify-content-center mt-3">
  <Button variant="success" size="lg" className="mx-4" onClick={handleUpload}>
    Upload
  </Button>
  <Button variant="danger" size="lg" className="mx-4" onClick={handleLogout}>
    Logout
  </Button>
</div>

          </>
        ) : (
          <>
            <h2>Login or Sign Up to View Profile</h2>
            <Button variant="primary" size="lg" className="mx-2"onClick={() => setShowModal(true)}>
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
