import { useState, useEffect, useRef } from 'react'
import { db, ref, push, onValue } from '../../../firebase/firebase'
import { getFromLocalStorage } from '~/components/MaHoaLocalStorage/MaHoaLocalStorage'

const FloatingChatbot = ({ userName }) => {
  const [isChatOpen, setIsChatOpen] = useState(false); // Toggle chat visibility
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const chatBodyRef = useRef();
  const userId = getFromLocalStorage('userId');

  useEffect(() => {
    if (!userId) return;

    const messagesRef = ref(db, `messages/${userId}`);
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const msgList = [];
      const data = snapshot.val();

      if (data) {
        for (const key in data) {
          const message = data[key];
          if (message) {
            msgList.push({ id: key, ...message });
          }
        }
      }

      setMessages(msgList);
    });

    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!userName || inputMessage.trim() === '') {
      alert('Vui lòng nhập tên và tin nhắn!');
      return;
    }

    const messageData = {
      name: userName,
      message: inputMessage,
      isSupport: false, // Tin nhắn của người dùng
      timestamp: Date.now(),
    };

    push(ref(db, `messages/${userId}`), messageData);
    setInputMessage('');
  };

  return (
    <div>
      {!isChatOpen && (
        <div
          style={styles.floatingButton}
          onClick={() => setIsChatOpen(true)}
        >
          💬 Chat
        </div>
      )}

      {isChatOpen && (
        <div style={styles.container}>
          <div style={styles.header}>
            <h3>Chatbot Hỗ trợ</h3>
            <button style={styles.closeButton} onClick={() => setIsChatOpen(false)}>
              ✕
            </button>
          </div>
          <div style={styles.chatBody} ref={chatBodyRef}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  ...styles.message,
                  alignSelf: msg.isSupport ? 'flex-start' : 'flex-end',
                  backgroundColor: msg.isSupport ? '#e1f5fe' : '#c8e6c9',
                }}
              >
                <strong>{msg.name}</strong>: {msg.message}
              </div>
            ))}
          </div>
          <div style={styles.inputContainer}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Nhập tin nhắn..."
              style={styles.input}
            />
            <button onClick={handleSendMessage} style={styles.button}>
              Gửi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  floatingButton: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: '#6200ea',
    color: '#fff',
    padding: '10px 15px',
    borderRadius: '50%',
    boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    textAlign: 'center',
    fontSize: '18px',
  },
  container: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '300px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    padding: '10px',
    backgroundColor: '#6200ea',
    color: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
  },
  chatBody: {
    height: '300px',
    overflowY: 'auto',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  message: {
    padding: '10px',
    borderRadius: '10px',
    maxWidth: '70%',
  },
  inputContainer: {
    display: 'flex',
    padding: '10px',
    borderTop: '1px solid #ccc',
  },
  input: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  button: {
    marginLeft: '10px',
    padding: '10px',
    backgroundColor: '#6200ea',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default FloatingChatbot;