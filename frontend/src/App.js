import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import MentorList from "./pages/MentorList";
import MentorRecommendation from "./pages/MentorRecommendation";
import ProfilePage from "./pages/Profile";
import MentorDetails from "./pages/MentorDetails";
import ChatPage from "./pages/ChatPage";
import UserList from "./pages/UserList";

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ marginTop: "70px" }}>
        {/* Added marginTop: 80px to push content down */}
        <Routes>
          <Route path="/mentors" element={<MentorList />} />
          <Route path="/" element={<Home />} />
          <Route path="/userlist" element={<UserList />} />
          <Route path="/mentors/:id" element={<MentorDetails />} />
          <Route path="/recommend" element={<MentorRecommendation />} />
          <Route path="/chat/:roomId" element={<ChatPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
