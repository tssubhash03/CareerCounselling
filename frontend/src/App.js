import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import MentorList from "./pages/MentorList";
import MentorRecommendation from "./pages/MentorRecommendation";
import Profile from "./pages/Profile";
import MentorDetails from "./pages/MentorDetails";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mentors" element={<MentorList />} />
        <Route path="/mentors/:id" element={<MentorDetails />} />
        <Route path="/recommend" element={<MentorRecommendation />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
