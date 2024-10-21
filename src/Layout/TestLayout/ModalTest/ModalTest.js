/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useEffect } from 'react'

import { Modal } from '../../../components/Modal'
import { useToast } from '../../../components/GlobalStyles/ToastContext'

function ModalTest ({ isOpen, onClose, fetchData }) {
  const [name, setName] = useState('')

  const { showToast } = useToast()

  const handleAddNhaCungCap = async () => {
    try {
      const response = await fetch(`https://baominhmobile.com/posttestmodel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name
        })
      })
      if (response.ok) {
        fetchData()
        handleClose()
        showToast('Thêm test thành công')
      } else {
        showToast('Thêm test thất bại', 'error')
        onClose()
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu thêm nhà cung cấp:', error)
      showToast(`Thêm tets thất bại ${error}`, 'error')
      handleClose()
    }
  }

  const resetForm = useCallback(() => {
    setName('')
  }, [])

  const handleClose = () => {
    resetForm()
    onClose()
  }

  useEffect(() => {
    const eventSource = new EventSource('https://baominhmobile.com/events')

    eventSource.onmessage = event => {
      const newMessage = JSON.parse(event.data)
      showToast(newMessage.message)
      fetchData()
    }

    return () => {
      eventSource.close()
    }
  }, [])

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className='divAddNhaCungCap'>
        <h2>Thêm</h2>
        <div className='divtenkho'>
          <input
            type='text'
            className={`tenkho`}
            placeholder=''
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <label htmlFor='' className='label'>
            Nhập tên
          </label>
        </div>

        <button onClick={handleAddNhaCungCap} className='btnAddNhaCungCap'>
          Thêm
        </button>
        <button onClick={handleClose} className='btnhuyAddNhaCungCap'>
          Hủy
        </button>
      </div>
    </Modal>
  )
}

export default ModalTest
