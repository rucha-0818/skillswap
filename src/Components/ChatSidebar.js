// src/components/ChatSidebar.js
import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  serverTimestamp
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function ChatSidebar({ onSelect }) {
  const [tab, setTab] = useState("chats");
  const [chats, setChats] = useState([]);
  const [requests, setRequests] = useState([]);
  const [user, setUser] = useState(null);

  // auth listener
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubAuth();
  }, []);

  // chats + requests listeners
  useEffect(() => {
    if (!user) return;

    // Query chats where current user is a participant, most-recent first
    const chatsQ = query(
      collection(db, "chats"),
      where("users", "array-contains", user.uid),
      orderBy("updatedAt", "desc")
    );

    const unsubChats = onSnapshot(
      chatsQ,
      async (snapshot) => {
        // get raw chat docs
        const chatDocs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

        // enrich with the other participant's displayName (optional)
        const enriched = await Promise.all(
          chatDocs.map(async (chat) => {
            const otherUid =
              Array.isArray(chat.users) && chat.users.find((uid) => uid !== user.uid);
            let otherName = otherUid || "Unknown";
            if (otherUid) {
              try {
                const otherDoc = await getDoc(doc(db, "users", otherUid));
                if (otherDoc.exists()) otherName = otherDoc.data().displayName || otherUid;
              } catch (err) {
                // ignore lookup errors
              }
            }
            return { ...chat, otherName };
          })
        );

        setChats(enriched);
      },
      (err) => {
        console.error("Chats listener error:", err);
      }
    );

    // requests directed to this user (incoming requests)
    const reqQ = query(collection(db, "requests"), where("to", "==", user.uid));
    const unsubReq = onSnapshot(
      reqQ,
      (snapshot) => {
        setRequests(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
      (err) => console.error("Requests listener error:", err)
    );

    return () => {
      unsubChats();
      unsubReq();
    };
  }, [user]);

  const acceptRequest = async (req) => {
    if (!user) return;
    try {
      const chatId = [req.from, req.to].sort().join("_");
      await setDoc(
        doc(db, "chats", chatId),
        {
          users: [req.from, req.to],
          lastMessage: "",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true } // safe: don't overwrite existing messages
      );

      await deleteDoc(doc(db, "requests", req.id));

      // open the newly created chat
      onSelect(chatId);
    } catch (err) {
      console.error("Error accepting request:", err);
    }
  };

  const declineRequest = async (reqId) => {
    try {
      await deleteDoc(doc(db, "requests", reqId));
    } catch (err) {
      console.error("Error declining request:", err);
    }
  };

  return (
    <div style={{ width: 280, backgroundColor: "#111", color: "white", display: "flex", flexDirection: "column" }}>
      <div style={{ backgroundColor: "#009688", padding: "14px", fontWeight: "600", textAlign: "center" }}>Skill Swap</div>

      <div style={{ display: "flex" }}>
        <div onClick={() => setTab("chats")} style={{ flex: 1, padding: 10, textAlign: "center", cursor: "pointer", backgroundColor: tab === "chats" ? "#222" : "#111" }}>Chat History</div>
        <div onClick={() => setTab("requests")} style={{ flex: 1, padding: 10, textAlign: "center", cursor: "pointer", backgroundColor: tab === "requests" ? "#222" : "#111" }}>Requests</div>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {tab === "chats" &&
          (chats.length === 0 ? (
            <div style={{ padding: 16, color: "#aaa" }}>No chats yet...</div>
          ) : (
            chats.map((chat) => (
              <div key={chat.id} onClick={() => onSelect(chat.id)} style={{ padding: 12, borderBottom: "1px solid #222", cursor: "pointer" }}>
                <div style={{ fontWeight: 600 }}>{chat.otherName || "Unknown"}</div>
                <div style={{ fontSize: 13, color: "#bbb", marginTop: 6 }}>{chat.lastMessage || "Say hi 👋"}</div>
              </div>
            ))
          ))}

        {tab === "requests" &&
          (requests.length === 0 ? (
            <div style={{ padding: 16, color: "#aaa" }}>No requests</div>
          ) : (
            requests.map((req) => (
              <div key={req.id} style={{ padding: 12, borderBottom: "1px solid #222" }}>
                <div style={{ fontWeight: 600 }}>{req.fromName || req.from}</div>
                <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                  <button onClick={() => acceptRequest(req)} style={{ flex: 1, backgroundColor: "#009688", color: "#fff", padding: 8, border: "none", borderRadius: 6 }}>Accept</button>
                  <button onClick={() => declineRequest(req.id)} style={{ flex: 1, backgroundColor: "#b71c1c", color: "#fff", padding: 8, border: "none", borderRadius: 6 }}>Decline</button>
                </div>
              </div>
            ))
          ))}
      </div>
    </div>
  );
}
