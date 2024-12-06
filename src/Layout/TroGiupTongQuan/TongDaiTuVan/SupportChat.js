import { useState, useEffect, useRef } from 'react'
import { db, ref, push, onValue } from '../../../firebase/firebase'
const SupportChat = () => {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const chatBodyRef = useRef()

  useEffect(() => {
    const messagesRef = ref(db, 'messages')
    const unsubscribe = onValue(messagesRef, snapshot => {
      const msgList = []
      snapshot.forEach(child => {
        msgList.push({ ...child.val(), id: child.key })
      })
      setMessages(msgList)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight
    }
  }, [messages])

  const handleReply = () => {
    if (inputMessage.trim() === '') return
    push(ref(db, 'messages'), {
      name: 'Tổng đài',
      message: inputMessage,
      isSupport: true // Tin nhắn từ tổng đài
    })
    setInputMessage('')
  }

  return (
    <div style={styles.container}>
      <h3>Quản lý Hỗ trợ</h3>
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
          placeholder='Nhập phản hồi...'
          style={styles.input}
        />
        <button onClick={handleReply} style={styles.button}>
          Gửi
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: { width: '600px', margin: '20px auto', textAlign: 'center' },
  chatBody: {
    height: '400px',
    border: '1px solid #ccc',
    borderRadius: '8px',
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
  inputContainer: { display: 'flex', padding: '10px' },
  input: {
    flex: 1,
    padding: '10px',
    marginRight: '10px',
    border: '1px solid #ccc'
  },
  button: {
    padding: '10px',
    cursor: 'pointer',
    backgroundColor: '#6200ea',
    color: '#fff'
  }
}

export default SupportChat
