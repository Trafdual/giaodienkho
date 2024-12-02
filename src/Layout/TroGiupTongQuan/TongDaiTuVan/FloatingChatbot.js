import React, { useState } from "react";

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div style={styles.container}>
      {isOpen && (
        <div style={styles.chatWindow}>
          <div style={styles.header}>
            <span>Trợ giúp trực tuyến</span>
            <button style={styles.closeButton} onClick={toggleChat}>
              ✖
            </button>
          </div>
          <div style={styles.body}>
            <p>Chào bạn! Mình có thể giúp gì cho bạn?</p>
            <textarea placeholder="Nhập tin nhắn..." style={styles.input}></textarea>
            <button style={styles.sendButton}>Gửi</button>
          </div>
        </div>
      )}
      {!isOpen && (
        <button style={styles.chatButton} onClick={toggleChat}>
          💬 Chat
        </button>
      )}
    </div>
  );
};

const styles = {
  container: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: 1000,
  },
  chatWindow: {
    width: "300px",
    height: "400px",
    backgroundColor: "#fff",
    boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    padding: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    borderTopLeftRadius: "10px",
    borderTopRightRadius: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "#fff",
    cursor: "pointer",
  },
  body: {
    flex: 1,
    padding: "10px",
    display: "flex",
    flexDirection: "column",
  },
  input: {
    marginTop: "auto",
    width: "100%",
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  sendButton: {
    marginTop: "8px",
    padding: "8px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  chatButton: {
    width: "60px",
    height: "60px",
    backgroundColor: "#007bff",
    color: "#fff",
    borderRadius: "50%",
    border: "none",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    fontSize: "24px",
    boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
  },
};

export default FloatingChatbot;
