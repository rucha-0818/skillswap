import React, { useState } from "react";
import ChatSidebar from "../Components/ChatSidebar";
import ChatRoom from "../pages/ChatRoom";

export default function ChatPage() {
  const [activeChat, setActiveChat] = useState(null);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#121212",
        color: "white",
      }}
    >
      {/* Sidebar */}
      <ChatSidebar onSelect={setActiveChat} />

      {/* Chat Room */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {activeChat ? (
          <ChatRoom chatId={activeChat} />
        ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              color: "#888",
            }}
          >
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
