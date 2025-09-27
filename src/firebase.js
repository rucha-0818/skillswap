import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; 

// 🔹 Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD6k3hqIh_rqIcbduvfdxOSsgsdLQehBRI",
  authDomain: "skillswap-e43e2.firebaseapp.com",
  projectId: "skillswap-e43e2",
  storageBucket: "skillswap-e43e2.appspot.com", // fix storage URL
  messagingSenderId: "870024149980",
  appId: "1:870024149980:web:7025a0d4c99a53a3f86d19",
  measurementId: "G-X9589R2JCR"
};

// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔹 Export Auth, Firestore, and Storage
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
