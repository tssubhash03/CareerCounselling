import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import MentorList from "./pages/MentorList";
import MentorRecommendation from "./pages/MentorRecommendation";
import ProfilePage from "./pages/Profile";
import MentorDetails from "./pages/MentorDetails";
import ChatPage from "./pages/ChatPage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mentors" element={<MentorList />} />
        <Route path="/mentors/:id" element={<MentorDetails />} />
        <Route path="/recommend" element={<MentorRecommendation />} />
        <Route path="/chat/:roomId" element={<ChatPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
