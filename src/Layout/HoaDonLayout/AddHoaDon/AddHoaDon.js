import { useState, useCallback } from 'react'

import { Modal } from '../../../components/Modal'
import { useToast } from '../../../components/GlobalStyles/ToastContext'
import './AddHoaDon.scss'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function AddHoaDon ({ isOpen, onClose, khoID, fetchData }) {
  const [makh, setMakh] = useState('')
  const [masp, setMasp] = useState('') // Mã sản phẩm hiện tại
  const [mangmasp, setMangmasp] = useState([]) // Danh sách mã sản phẩm

  const { showToast } = useToast()
  const [makhError, setMakhError] = useState('')
  const [maspError, setMaspError] = useState('')

  // Hàm validate thông tin
  const validateInputs = () => {
    let valid = true

    if (!makh) {
      setMakhError('Vui lòng nhập mã khách hàng.')
      valid = false
    } else {
      setMakhError('')
    }

    return valid
  }

  // Thêm mã sản phẩm khi nhấn Enter
  const handleKeyPress = event => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleAddMasp()
    }
  }

  // Thêm mã sản phẩm vào danh sách
  const handleAddMasp = () => {
    if (!masp) {
      setMaspError('Vui lòng nhập mã sản phẩm.')
      return
    }

    setMangmasp(prevMangmasp => [...prevMangmasp, masp]) // Cập nhật danh sách mã sản phẩm
    setMasp('') // Xóa input mã sản phẩm sau khi thêm
    setMaspError('')
  }

  // Xóa mã sản phẩm khỏi danh sách
  const handleRemoveMasp = index => {
    const newMangmasp = [...mangmasp]
    newMangmasp.splice(index, 1)
    setMangmasp(newMangmasp)
  }

  // Gửi dữ liệu tạo hóa đơn
  const handleAddHoaDon = async () => {
    if (validateInputs()) {
      try {
        const response = await fetch(
          `http://localhost:8080/posthoadon/${khoID}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              makhachhang: makh,
              masanpham: mangmasp // Gửi danh sách mã sản phẩm
            })
          }
        )
        const data = await response.json()

        if (data.message) {
          showToast(`Thêm hóa đơn thất bại: ${data.message}`, 'error')
          onClose()
          setMangmasp([])
        } else {
          fetchData()
          handleClose()
          showToast('Thêm hóa đơn thành công')
          setMangmasp([]) // Reset danh sách mã sản phẩm sau khi thêm thành công
        }
      } catch (error) {
        console.error('Lỗi khi gửi yêu cầu thêm hóa đơn:', error)
        showToast(`Thêm hóa đơn thất bại: ${error}`, 'error')
        handleClose()
      }
    }
  }

  // Reset form
  const resetForm = useCallback(() => {
    setMakh('')
    setMasp('')
    setMangmasp([]) // Reset danh sách mã sản phẩm
    setMakhError('')
    setMaspError('')
  }, [])

  // Đóng modal
  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className='divAddHoaDon'>
        <h2>Thêm hóa đơn</h2>
        <div className='divtenkho'>
          <input
            type='text'
            className={`tenkho ${makhError ? 'input-error' : ''}`}
            placeholder=''
            value={makh}
            onChange={e => setMakh(e.target.value)}
          />
          <label htmlFor='' className='label'>
            Nhập mã khách hàng
          </label>
        </div>
        {makhError && <div className='error'>{makhError}</div>}

        {/* Nhập mã sản phẩm */}
        <div className='divdiachikho'>
          <input
            type='text'
            className={`diachi ${maspError ? 'input-error' : ''}`}
            placeholder=''
            value={masp}
            onChange={e => setMasp(e.target.value)}
            onKeyPress={handleKeyPress} // Xử lý sự kiện Enter
          />
          <label htmlFor='' className='label'>
            Nhập mã sản phẩm
          </label>
        </div>
        {maspError && <div className='error'>{maspError}</div>}

        {/* Hiển thị danh sách mã sản phẩm */}
        {mangmasp.length > 0 && (
          <div className='mangmasp-list'>
            <h4>Danh sách mã sản phẩm:</h4>
            <ul className='ulmangmasp'>
              {mangmasp.map((item, index) => (
                <li key={index} className='mangmasp-item'>
                  {item}{' '}
                  <button
                    className='remove-btn'
                    onClick={() => handleRemoveMasp(index)}
                  >
                    <FontAwesomeIcon className='remove-icon' icon={faXmark} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Nút thêm hóa đơn */}
        <button onClick={handleAddHoaDon} className='btnAddHoaDon'>
          Thêm hóa đơn
        </button>
        <button onClick={handleClose} className='btnhuyAddHoaDon'>
          Hủy
        </button>
      </div>
    </Modal>
  )
}

export default AddHoaDon
