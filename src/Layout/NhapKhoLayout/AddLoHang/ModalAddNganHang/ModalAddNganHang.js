import { useState } from 'react'

import { Modal } from '../../../../components/Modal'
import { useToast } from '../../../../components/GlobalStyles/ToastContext'

function ModalAddNganHang
 ({ isOpen, onClose, userId, setdatakho }) {
  const [tenkho, setTenkho] = useState('')
  const { showToast } = useToast()
  const [tenkhoError, setTenKhoError] = useState('')

  const validateInputs = () => {
    let valid = true

    if (!tenkho) {
      setTenKhoError('Vui lòng nhập tên kho.')
      valid = false
    } else {
      setTenKhoError('')
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
            })
          }
        )
        const data = await response.json()
        if (response.ok) {
          setdatakho(prevkho => [...prevkho, data])
          onClose()
          showToast('Thêm kho thành công')
        } else {
          showToast('Thêm kho thất bại', 'error')
          onClose()
        }
      } catch (error) {
        console.error('Lỗi khi gửi yêu cầu thêm kho:', error)
        showToast('Thêm kho thất bại', 'error')
        onClose()
      }
    }
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className='divaddkho'>
        <h2>Thêm ngân hàng</h2>
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

export default ModalAddNganHang

