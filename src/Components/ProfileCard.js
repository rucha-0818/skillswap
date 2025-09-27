import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileCard.css";

function ProfileCard({ person }) {
  const navigate = useNavigate();
  if (!person) return null;

  return (
    <div
      className="user-card p-4 rounded-xl bg-[#1e1e1e] text-white shadow-md cursor-pointer"
      onClick={() => navigate(`/profile/${person.id}`)} // navigate on click
    >
      <img
        src={person.image || "/images/default.png"}
        alt={person.name || "Unknown"}
        className="w-24 h-24 rounded-full mx-auto"
      />
      <h2 className="text-xl font-bold mt-2">{person.name || "Unnamed"}</h2>

      <div className="flex mt-2 justify-center">
        {Array.from({ length: person.rating || 0 }).map((_, i) => (
          <span key={i} className="text-yellow-400">★</span>
        ))}
      </div>

      <p className="mt-2">{person.description || "No description available."}</p>

      <div className="mt-4">
        <h4 className="font-semibold">Can Teach:</h4>
        {(person.skillsToTeach?.length > 0 ? person.skillsToTeach : ["None"]).map(s => (
          <span key={s} className="skill-tag">{s}</span>
        ))}
      </div>

      <div className="mt-2">
        <h4 className="font-semibold">Wants to Learn:</h4>
        {(person.skillsToLearn?.length > 0 ? person.skillsToLearn : ["None"]).map(s => (
          <span key={s} className="skill-tag">{s}</span>
        ))}
      </div>
    </div>
  );
}

export default ProfileCard;
