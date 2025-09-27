import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
//import ChatRoom from "./pages/ChatRoom";
import UserProfile from "./pages/UserProfile";
import UsersPage from "./pages/UsersPage";

import Chat from "./pages/Chat";


import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route
          path="/"
          element={
            <div className="app-container">
              <Navbar />

              {/* Home Section */}
              <section id="home" className="section home">
                <div className="hero-container">
                  <h1 className="hero-title">Welcome to Skill Swap</h1>
                  <p className="hero-subtext">
                    Exchange skills, learn, and grow together!
                  </p>
                  <a href="/register" className="hero-button">
                    Get Started
                  </a>
                </div>
              </section>

              {/* About Us Section */}
              <section id="about" className="section about">
                <div className="container about-grid">
                  <div className="about-card">
                    <h3>Who We Are</h3>
                    <p>
                      We are a community-driven platform connecting learners and experts.
                      Our mission is to make knowledge-sharing simple and fun.
                    </p>
                  </div>

                  <div className="about-card">
                    <h3>Our Vision</h3>
                    <p>
                      To build a world where skills are freely exchanged, helping everyone 
                      grow personally and professionally.
                    </p>
                  </div>

                  <div className="about-card">
                    <h3>What We Offer</h3>
                    <p>
                      A space to learn new skills, share your knowledge, and collaborate 
                      with like-minded people across the globe.
                    </p>
                  </div>
                </div>
              </section>

              {/* Why Skill Swap Section */}
              <section id="why" className="section why">
                <div className="container about-grid">
                  <div className="about-card">
                    <h3>Learn New Skills</h3>
                    <p>
                      Explore new areas of knowledge from people who have real-world 
                      experience and practical insights.
                    </p>
                  </div>

                  <div className="about-card">
                    <h3>Teach & Share Knowledge</h3>
                    <p>
                      Share your own expertise and help others grow, while reinforcing 
                      your own skills in the process.
                    </p>
                  </div>

                  <div className="about-card">
                    <h3>Grow Together</h3>
                    <p>
                      Join a supportive community of learners and experts who believe 
                      in collaboration and growth.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          }
        />

        {/* Register Page */}
        <Route path="/register" element={<Register />} />

        {/* Login Page */}
        <Route path="/login" element={<Login />} />
         <Route path="/" element={<LandingPage />} />
        {/* Dashboard Page */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Users Page */}
        <Route path="/users" element={<UsersPage />} />

        {/* Profile Page */}
        <Route path="/profile/:id" element={<UserProfile />} />
        <Route path="/chat/:chatId" element={<Chat />} />

        
      

      </Routes>
    </Router>
  );
}

export default App;
