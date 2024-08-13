import { useState } from 'react'

import { Modal } from '../../../../components/Modal'
import { useToast } from '../../../../components/GlobalStyles/ToastContext'
import './AddKho.scss'

function AddKho ({ isOpen, onClose, userId }) {
  const [tenkho, setTenkho] = useState('')
  const [diachi, setDiachi] = useState('')
  const { showToast } = useToast()

  const handleAddKho = async () => {
    try {
      const response = await fetch(`https://www.ansuataohanoi.com/postdepot/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: tenkho,
          address: diachi
        })
      })
      if (response.ok) {
        onClose()
        showToast('Thêm kho thành công')
      } else {
        showToast('Thêm kho thất bại')
        onClose()
      }
    } catch (error) {}
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className='divaddkho'>
        <h2>Thêm kho hàng</h2>
        <div className='divtenkho'>
          <input
            type='text'
            className='tenkho'
            placeholder=''
            onChange={e => setTenkho(e.target.value)}
          />
          <label htmlFor='' className='label'>
            Nhập tên kho hàng
          </label>
        </div>
        <div className='divdiachikho'>
          <input
            type='text'
            className='diachi'
            placeholder=''
            onChange={e => setDiachi(e.target.value)}
          />
          <label htmlFor='' className='label'>
            Nhập địa chỉ kho
          </label>
        </div>
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
