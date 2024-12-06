import { useState, useEffect, useRef } from 'react'
import { db, ref, push, onValue } from '../../../firebase/firebase'
import { getFromLocalStorage } from '~/components/MaHoaLocalStorage/MaHoaLocalStorage'

const FloatingChatbot = ({ userName }) => {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const chatBodyRef = useRef()
  const userId = getFromLocalStorage('userId')

  useEffect(() => {
    if (!userId) return

    const messagesRef = ref(db, `messages/${userId}`)
    const unsubscribe = onValue(messagesRef, snapshot => {
      const msgList = []
      snapshot.forEach(child => {
        msgList.push(child.val())
      })
      setMessages(msgList)
    })

    return () => unsubscribe()
  }, [userId])

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = () => {
    if (!userName || inputMessage.trim() === '') {
      alert('Vui lòng nhập tên và tin nhắn!')
      return
    }

    const messageData = {
      name: userName,
      message: inputMessage,
      isSupport: false, // Tin nhắn của người dùng
      timestamp: Date.now()
    }

    push(ref(db, `messages/${userId}`), messageData)
    setInputMessage('')
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3>Chatbot Hỗ trợ</h3>
      </div>
      <div style={styles.chatBody} ref={chatBodyRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              alignSelf: msg.isSupport ? 'flex-start' : 'flex-end',
              backgroundColor: msg.isSupport ? '#e1f5fe' : '#c8e6c9'
            }}
          >
            <strong>{msg.name}</strong>: {msg.message}
          </div>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <input
          type='text'
          value={inputMessage}
          onChange={e => setInputMessage(e.target.value)}
          placeholder='Nhập tin nhắn...'
          style={styles.input}
        />
        <button onClick={handleSendMessage} style={styles.button}>
          Gửi
        </button>
      </div>
    </div>
  )
}

const styles = {
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
    flexDirection: 'column'
  },
  header: {
    padding: '10px',
    backgroundColor: '#6200ea',
    color: '#fff',
    textAlign: 'center'
  },
  chatBody: {
    height: '300px',
    overflowY: 'auto',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  message: {
    padding: '10px',
    borderRadius: '10px',
    maxWidth: '70%'
  },
  inputContainer: {
    display: 'flex',
    padding: '10px',
    borderTop: '1px solid #ccc'
  },
  input: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px'
  },
  button: {
    marginLeft: '10px',
    padding: '10px',
    backgroundColor: '#6200ea',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }
}

export default FloatingChatbot
