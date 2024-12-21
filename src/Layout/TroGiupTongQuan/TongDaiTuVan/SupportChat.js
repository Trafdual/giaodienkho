import { useState, useEffect, useRef } from 'react'
import { db, ref, push, onValue } from '../../../firebase/firebase'

const SupportChat = () => {
  const [users, setUsers] = useState([]) // Danh sách người dùng
  const [selectedUser, setSelectedUser] = useState(null) // User đang được chọn
  const [messages, setMessages] = useState([]) // Tin nhắn của user được chọn
  const [inputMessage, setInputMessage] = useState('')
  const chatBodyRef = useRef()

  // Lấy danh sách người dùng từ Firebase
  useEffect(() => {
    const usersRef = ref(db, 'messages')
    const unsubscribe = onValue(usersRef, snapshot => {
      const userList = []
      snapshot.forEach(child => {
        console.log('User data:', child.key, child.val())
        userList.push({ id: child.key, ...child.val() })
      })
      setUsers(userList)
    })
    return () => unsubscribe()
  }, [])

  // Lấy tin nhắn của user được chọn
  useEffect(() => {
    if (!selectedUser) return

    const messagesRef = ref(db, `messages/${selectedUser.id}`)
    const unsubscribe = onValue(messagesRef, snapshot => {
      const msgList = []
      const data = snapshot.val()

      if (data) {
        // Chuyển đổi dữ liệu thành mảng tin nhắn
        for (const key in data) {
          msgList.push({ ...data[key], id: key })
        }
      }

      setMessages(msgList)
    })

    return () => unsubscribe()
  }, [selectedUser])

  // Cuộn tin nhắn đến cuối
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight
    }
  }, [messages])

  // Gửi tin nhắn
  const handleReply = () => {
    if (inputMessage.trim() === '' || !selectedUser) return

    const messageData = {
      name: 'Tổng đài',
      message: inputMessage,
      isSupport: true, // Tin nhắn từ support
      timestamp: Date.now()
    }

    push(ref(db, `messages/${selectedUser.id}`), messageData)
    setInputMessage('')
  }

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h4>Danh sách người dùng</h4>
        {users.map(user => (
          <div
            key={user.id}
            style={{
              ...styles.user,
              backgroundColor: selectedUser?.id === user.id ? '#e0e0e0' : '#fff'
            }}
            onClick={() => setSelectedUser(user)}
          >
            {user.name}
          </div>
        ))}
      </div>

      <div style={styles.chatSection}>
        <h3>Hỗ trợ - {selectedUser ? selectedUser.name : 'Chọn người dùng'}</h3>
        <div style={styles.chatBody} ref={chatBodyRef}>
          {selectedUser ? (
            messages.map((msg, index) => (
              <div
                key={msg.id || index}
                style={{
                  ...styles.message,
                  alignSelf: msg.isSupport ? 'flex-start' : 'flex-end',
                  backgroundColor: msg.isSupport ? '#e1f5fe' : '#c8e6c9'
                }}
              >
                <strong>{msg.name}</strong>: {msg.message}
              </div>
            ))
          ) : (
            <div style={styles.placeholder}>
              Chọn người dùng để xem tin nhắn
            </div>
          )}
        </div>
        <div style={styles.inputContainer}>
          <input
            type='text'
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            placeholder='Nhập phản hồi...'
            style={styles.input}
            disabled={!selectedUser}
          />
          <button
            onClick={handleReply}
            style={styles.button}
            disabled={!selectedUser}
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { display: 'flex', width: '800px', margin: '20px auto' },
  sidebar: {
    width: '200px',
    borderRight: '1px solid #ccc',
    padding: '10px',
    overflowY: 'auto'
  },
  user: {
    padding: '10px',
    cursor: 'pointer',
    borderBottom: '1px solid #ccc'
  },
  chatSection: { flex: 1, padding: '10px' },
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
  placeholder: {
    color: '#888',
    textAlign: 'center',
    padding: '20px'
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
