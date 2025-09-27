import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, db, storage } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FaUser, FaEnvelope, FaLock, FaBook, FaChalkboardTeacher, FaInfoCircle } from "react-icons/fa";
import "./Register.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [skillsToLearn, setSkillsToLearn] = useState("");
  const [skillsToTeach, setSkillsToTeach] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const uc = await createUserWithEmailAndPassword(auth, email, password);
      const user = uc.user;
      let imageUrl = "";

      if (imageFile) {
        const storageRef = ref(storage, `profileImages/${user.uid}/${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        description,
        image: imageUrl,
        skillsToLearn: skillsToLearn ? skillsToLearn.split(",").map(s => s.trim()) : [],
        skillsToTeach: skillsToTeach ? skillsToTeach.split(",").map(s => s.trim()) : [],
        rating: 0,
        createdAt: serverTimestamp()
      });

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  return (
    <div className="register-page">
      <form onSubmit={handleRegister} className="form-container">
        <h1>Create an Account</h1>

        <div className="input-group">
          <FaUser className="icon" />
          <input placeholder="Full name" value={name} onChange={e => setName(e.target.value)} required />
        </div>

        <div className="input-group">
          <FaEnvelope className="icon" />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>

        <div className="input-group">
          <FaLock className="icon" />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>

        <div className="input-group">
          <FaInfoCircle className="icon" />
          <textarea placeholder="Short description" value={description} onChange={e => setDescription(e.target.value)} />
        </div>

        <div className="input-group">
          <FaBook className="icon" />
          <input placeholder="Skills you want to learn (comma separated)" value={skillsToLearn} onChange={e => setSkillsToLearn(e.target.value)} />
        </div>

        <div className="input-group">
          <FaChalkboardTeacher className="icon" />
          <input placeholder="Skills you can teach (comma separated)" value={skillsToTeach} onChange={e => setSkillsToTeach(e.target.value)} />
        </div>

        <button type="submit">Register</button>

        <p className="login-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
