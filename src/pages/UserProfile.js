import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import ProfileCard from "../Components/ProfileCard";

function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const docRef = doc(db, "users", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUser({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("User not found");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) return <p>Loading user...</p>;
  if (!user) return <p>User not found.</p>;

  return (
    <div className="p-4">
      <button
        className="mb-4 px-3 py-1 bg-gray-700 text-white rounded"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>
      <ProfileCard person={user} />
    </div>
  );
}

export default UserProfile;
