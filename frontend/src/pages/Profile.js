import React, { useState, useEffect } from "react";
import { Button, Container, Card } from "react-bootstrap";
import AuthModal from "../components/AuthModal";

const Profile = () => {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Function to update user state from localStorage
    const updateUser = () => {
      const storedUser = localStorage.getItem("userInfo");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };

    // Run when the page loads
    updateUser();

    // Listen for storage changes (when another component updates localStorage)
    window.addEventListener("storage", updateUser);

    return () => {
      window.removeEventListener("storage", updateUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
  };

  return (
    <Container className="mt-5">
      <Card className="p-4 shadow-lg text-center">
        {user ? (
          <>
            <h2>Welcome, {user.name}!</h2>
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
