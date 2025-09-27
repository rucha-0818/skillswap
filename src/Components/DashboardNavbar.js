// src/Components/DashboardNavbar.js
import React from "react";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import "./DashboardNavbar.css";

const DashboardNavbar = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/"; // redirect to landing page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <Link to="/dashboard">
          <img
            src="https://play-lh.googleusercontent.com/yVphJwxijwV131_Tv2BS3OaWP-qTJqwls-2ReOmORfUo7ZZFMmbfLj1W_wEWAHDnoQ=w240-h480-rw"
            alt="Skill Swap"
            height={50}
          />
        </Link>
      </div>
      <div className="dashboard-links">

    
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
