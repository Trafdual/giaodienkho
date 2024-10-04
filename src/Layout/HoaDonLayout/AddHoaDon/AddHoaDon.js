import { useState, useCallback } from 'react'

import { Modal } from '../../../components/Modal'
import { useToast } from '../../../components/GlobalStyles/ToastContext'
import './AddHoaDon.scss'

function AddHoaDon ({ isOpen, onClose, khoID, fetchData }) {
  const [makh, setMakh] = useState('')
  const [masp, setMasp] = useState('')
  const [mangmasp, setmangmasp] = useState([])

  const { showToast } = useToast()
  const [makhError, setmakhError] = useState('')
  const [maspError, setmaspError] = useState('')

  const validateInputs = () => {
    let valid = true

    if (!makh) {
      setMakh('Vui lòng nhập mã khách hàng.')
      valid = false
    } else {
      setmakhError('')
    }
    if (!masp) {
      setMasp('Vui lòng nhập mã sản phẩm.')
      valid = false
    } else {
      setmaspError('')
    }

    return valid
  }

  const handleAddHoaDon = async () => {
    if (validateInputs()) {
      const newMangmasp = [...mangmasp, masp]
      setmangmasp(newMangmasp) // Cập nhật trạng thái

      try {
        const response = await fetch(
          `https://www.ansuataohanoi.com/posthoadon/${khoID}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              makhachhang: makh,
              masanpham: newMangmasp
            })
          }
        )
        const data = await response.json()

        if (data.message) {
          showToast(`Thêm hóa đơn thất bại ${data.message}`, 'error')
          onClose()
          setmangmasp([])
        } else {
          fetchData()
          handleClose()
          showToast('Thêm hóa đơn thành công')
          setmangmasp([])
        }
      } catch (error) {
        console.error('Lỗi khi gửi yêu cầu thêm hóa đơn:', error)
        showToast(`Thêm hóa đơn thất bại ${error}`, 'error')
        handleClose()
      }
    }
  }

  const resetForm = useCallback(() => {
    setMakh('')
    setMasp('')
    setmakhError('')
    setmaspError('')
  }, [])

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
        <div className='divdiachikho'>
          <input
            type='text'
            className={`diachi ${maspError ? 'input-error' : ''}`}
            placeholder=''
            value={masp}
            onChange={e => setMasp(e.target.value)}
          />
          <label htmlFor='' className='label'>
            Nhập mã sản phẩm
          </label>
        </div>
        {maspError && <div className='error'>{maspError}</div>}

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
