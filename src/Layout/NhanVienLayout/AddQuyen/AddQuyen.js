/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { Modal } from '../../../components/Modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './AddQuyen.scss'
import { useToast } from '../../../components/GlobalStyles/ToastContext'
import {
  faDeleteLeft,
  faFloppyDisk,
  faXmarkCircle
} from '@fortawesome/free-solid-svg-icons'

const AddQuyen = ({ idncc, isOpen, onClose, fetchdata }) => {
  const { showToast } = useToast()
  const [quyen, setQuyen] = useState([])
  const validRoles = [
    { key: 'quanly', label: 'Quản lý' },
    { key: 'banhang', label: 'Bán hàng' },
    { key: 'ketoan', label: 'Kế toán' }
  ]

  const fetchquyen = async () => {
    try {
      const response = await fetch(`http://localhost:3015/quyennv/${idncc}`)
      const data = await response.json()
      if (response.ok) {
        setQuyen(data.quyen)
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu lấy quyền:', error)
    }
  }

  useEffect(() => {
    if (isOpen && idncc) {
      fetchquyen()
    }
  }, [idncc, isOpen])

  const handleToggleRole = role => {
    setQuyen(prev =>
      prev.includes(role) ? prev.filter(q => q !== role) : [...prev, role]
    )
  }

  const handleSave = async () => {
    try {
      const response = await fetch(
        `http://localhost:3015/addquyennv/${idncc}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quyen })
        }
      )
      if (response.ok) {
        fetchdata()
        fetchquyen()
        onClose()
        showToast('Thêm quyền thành công', 'success')
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu lưu quyền:', error)
    }
  }

  const handleRemove = async () => {
    try {
      const response = await fetch(
        `http://localhost:3015/removequyennv/${idncc}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quyen })
        }
      )
      if (response.ok) {
        fetchdata()
        fetchquyen()
        onClose()
        showToast('Xóa quyền thành công', 'success')
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu xóa quyền:', error)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className='add-quyen-container'>
        <h3 className='add-quyen-title'>Cập nhật quyền nhân viên</h3>
        <div className='quyen-checkbox-group'>
          {validRoles.map(({ key, label }) => (
            <label key={key} className='quyen-checkbox-label'>
              <input
                type='checkbox'
                checked={quyen.includes(key)}
                onChange={() => handleToggleRole(key)}
              />
              {label}
            </label>
          ))}
        </div>
        <div className='quyen-button-group'>
          <button className='quyen-save-btn' onClick={handleSave}>
            <FontAwesomeIcon icon={faFloppyDisk} className='iconaddquyen' />
            Lưu
          </button>
          <button className='quyen-remove-btn' onClick={handleRemove}>
            <FontAwesomeIcon icon={faDeleteLeft} className='iconaddquyen' />
            Xóa quyền
          </button>
          <button className='quyen-close-btn' onClick={onClose}>
            <FontAwesomeIcon icon={faXmarkCircle} className='iconaddquyen' />
            Đóng
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default AddQuyen
