// src/pages/Dashboard.js
import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import DashboardNavbar from "../Components/DashboardNavbar";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const [people, setPeople] = useState([]);
  const [skillsToLearn, setSkillsToLearn] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserSkills = async () => {
      const user = auth.currentUser;
      if (user) {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          setSkillsToLearn(snap.data().skillsToLearn || []);
        }
      }
    };
    fetchUserSkills();

    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      setPeople(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    const unsubRequests = onSnapshot(collection(db, "requests"), (snapshot) => {
      setRequests(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubUsers();
      unsubRequests();
    };
  }, []);

  // ✅ Match check
  const isMatch = (person) => {
    if (person.id === auth.currentUser?.uid) return false;
    const teach = person.skillsToTeach || [];
    return teach.some((skill) => skillsToLearn.includes(skill));
  };

  // ✅ Accepted connection check
  const hasAcceptedConnection = (personId) => {
    return requests.some(
      (r) =>
        ((r.from === auth.currentUser.uid && r.to === personId) ||
          (r.from === personId && r.to === auth.currentUser.uid)) &&
        r.status === "accepted"
    );
  };

  // ✅ Send request
  const handleConnect = async (otherUserId) => {
    try {
      const requestId = `${auth.currentUser.uid}_${otherUserId}`;
      await setDoc(doc(db, "requests", requestId), {
        from: auth.currentUser.uid,
        to: otherUserId,
        status: "pending",
        timestamp: serverTimestamp(),
      });
      alert("Connection request sent!");
    } catch (err) {
      console.error(err);
      alert("Failed to send request. Check console.");
    }
  };

  // ✅ Accept request
  const handleAccept = async (requestId) => {
    try {
      await setDoc(
        doc(db, "requests", requestId),
        { status: "accepted" },
        { merge: true }
      );
      alert("Request accepted!");
    } catch (err) {
      console.error(err);
      alert("Failed to accept request.");
    }
  };

  // ✅ Reject request
  const handleReject = async (requestId) => {
    try {
      await setDoc(
        doc(db, "requests", requestId),
        { status: "rejected" },
        { merge: true }
      );
      alert("Request rejected!");
    } catch (err) {
      console.error(err);
      alert("Failed to reject request.");
    }
  };

  // ✅ Filter only incoming requests for logged-in user
  const incomingRequests = requests.filter(
    (r) => r.to === auth.currentUser?.uid && r.status === "pending"
  );

  return (
    <div className="relative min-h-screen bg-[#121212]">
      <DashboardNavbar />

      {/* 🔹 Search bar */}
      <div className="p-4 flex justify-center">
        <input
          type="text"
          placeholder="Search by name or skill..."
          className="dashboard-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 🔹 Incoming Requests Section */}
      <div className="incoming-requests">
        <h2>Incoming Requests</h2>
        {incomingRequests.length === 0 ? (
          <p>No incoming requests</p>
        ) : (
          incomingRequests.map((req) => {
            const sender = people.find((p) => p.id === req.from);
            return (
              <div key={req.id} className="request-card">
                <span>{sender?.name || "Unnamed User"}</span>
                <button onClick={() => handleAccept(req.id)}>Accept</button>
                <button onClick={() => handleReject(req.id)}>Reject</button>
              </div>
            );
          })
        )}
      </div>

      {/* 🔹 People grid */}
      <div className="cards-grid">
        {people
          .filter(
            (person) =>
              person.id !== auth.currentUser?.uid &&
              (person.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (person.skillsToTeach || []).some((skill) =>
                  skill.toLowerCase().includes(searchTerm.toLowerCase())
                ))
          )
          .map((person) => {
            const matchFound = isMatch(person);
            const accepted = hasAcceptedConnection(person.id);
            return (
              <div
                key={person.id}
                className={`profile-card ${matchFound ? "match" : ""}`}
              >
                <img
                  src={
                    person.avatar ||
                    "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0="
                  }
                  alt={person.name || "Unnamed"}
                  className="profile-avatar"
                />
                <div className="profile-name">
                  {person.name || "Unnamed"}
                </div>
                <div className="profile-skills">
                  <strong>Skills to Teach:</strong>{" "}
                  {person.skillsToTeach?.join(", ") || "None"}
                </div>
                <div className="profile-skills">
                  <strong>Skills to Learn:</strong>{" "}
                  {person.skillsToLearn?.join(", ") || "None"}
                </div>
                {matchFound && <div className="match-skills">Match Found!</div>}

                {/* Connect */}
                {matchFound && !accepted && (
                  <button
                    className="connect-btn"
                    onClick={() => handleConnect(person.id)}
                  >
                    Connect
                  </button>
                )}

                {/* Chat */}
                {accepted && (
                  <button
                    className="connect-btn"
                    onClick={() =>
                      navigate(
                        `/chat/${[auth.currentUser.uid, person.id]
                          .sort()
                          .join("_")}`
                      )
                    }
                  >
                    Chat
                  </button>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
