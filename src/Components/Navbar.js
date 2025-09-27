import React from "react";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import CommentRoundedIcon from "@mui/icons-material/CommentRounded";
import PersonIcon from "@mui/icons-material/Person";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleScroll = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <img
          src="https://play-lh.googleusercontent.com/yVphJwxijwV131_Tv2BS3OaWP-qTJqwls-2ReOmORfUo7ZZFMmbfLj1W_wEWAHDnoQ=w240-h480-rw"
          alt="Skill swap"
        />
      </div>

      <div className="navbar-links">
        <button onClick={() => handleScroll("home")}><HomeIcon /> Home</button>
        <button onClick={() => handleScroll("about")}><InfoIcon /> About Us</button>
        <button onClick={() => handleScroll("why")}><CommentRoundedIcon /> Why Skill Swap</button>
        
        {/* Navigate instead of scroll */}
        <button onClick={() => navigate("/register")}>
          <PersonIcon /> Login/Register
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
