import { useState } from 'react'

import { Modal } from '../../../../components/Modal'
import { useToast } from '../../../../components/GlobalStyles/ToastContext'
import './AddKho.scss'

function AddKho ({ isOpen, onClose, userId }) {
  const [tenkho, setTenkho] = useState('')
  const [diachi, setDiachi] = useState('')
  const { showToast } = useToast()
  const [tenkhoError, setTenKhoError] = useState('')

  const [diachiError, setDiaChiError] = useState('')

  const validateInputs = () => {
    let valid = true

    if (!tenkho) {
      setTenKhoError('Vui lòng nhập tên kho.')
      valid = false
    } else {
      setTenKhoError('')
    }

    if (!diachi) {
      setDiaChiError('Vui lòng nhập địa chỉ.')
      valid = false
    } else {
      setDiaChiError('')
    }

    return valid
  }

  const handleAddKho = async () => {
    if (validateInputs()) {
      try {
        const response = await fetch(
          `https://www.ansuataohanoi.com/postdepot/${userId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: tenkho,
              address: diachi
            })
          }
        )
        if (response.ok) {
          onClose()
          showToast('Thêm kho thành công')
        } else {
          showToast('Thêm kho thất bại','error')
          onClose()
        }
      } catch (error) {
        console.error('Lỗi khi gửi yêu cầu thêm kho:', error)
        showToast('Thêm kho thất bại','error')
        onClose()
      }
    }
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className='divaddkho'>
        <h2>Thêm kho hàng</h2>
        <div className='divtenkho'>
          <input
            type='text'
            className={`tenkho ${tenkhoError ? 'input-error' : ''}`}
            placeholder=''
            onChange={e => setTenkho(e.target.value)}
          />
          <label htmlFor='' className='label'>
            Nhập tên kho hàng
          </label>
        </div>
        {tenkhoError && <div className='error'>{tenkhoError}</div>}

        <div className='divdiachikho'>
          <input
            type='text'
            className={`diachi ${diachiError ? 'input-error' : ''}`}
            placeholder=''
            onChange={e => setDiachi(e.target.value)}
          />
          <label htmlFor='' className='label'>
            Nhập địa chỉ kho
          </label>
        </div>
        {diachiError && <div className='error'>{diachiError}</div>}

        <hr />
        <button onClick={handleAddKho} className='btnaddkho'>
          Thêm Kho
        </button>
        <button onClick={() => alert('Hủy thêm kho')} className='btnhuyaddkho'>
          Hủy
        </button>
      </div>
    </Modal>
  )
}

export default AddKho