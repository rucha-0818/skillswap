import React, { useState } from "react";
import ProfileCard from "../Components/ProfileCard";

function UsersPage() {
  const defaultUsers = [
    {
      id: "1",
      name: "John Doe",
      image: "/images/default.png",
      description: "I teach React",
      skillsToTeach: ["React"],
      skillsToLearn: ["Python"],
      rating: 4,
    },
    {
      id: "2",
      name: "Jane Smith",
      image: "/images/default.png",
      description: "I teach Python",
      skillsToTeach: ["Python"],
      skillsToLearn: ["React"],
      rating: 3,
    },
  ];

  const [users, setUsers] = useState(defaultUsers);
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full p-2 rounded border mb-4"
      />

      {/* 🔹 Quick debug */}
      <p>Users count: {filteredUsers.length}</p>
      <p>Users array: {JSON.stringify(users)}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map(user => (
          <ProfileCard key={user.id} person={user} />
        ))}
      </div>
    </div>
  );
}

export default UsersPage;
