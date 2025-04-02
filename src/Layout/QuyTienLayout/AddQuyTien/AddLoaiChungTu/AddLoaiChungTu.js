import { useState, useCallback } from 'react'

import { Modal } from '~/components/Modal'
import { useToast } from '~/components/GlobalStyles/ToastContext'
import { ModalOnClose } from '~/components/ModalOnClose'
import { getApiUrl } from '../../../../api/api'

function AddLoaiChungTu ({ isOpen, onClose, userID, fetchdata }) {
  const [name, setName] = useState('')
  const [method, setmethod] = useState('')

  const { showToast } = useToast()
  const names = ['Phiếu chi', 'Phiếu thu']
  const methods = ['Tiền gửi', 'Tiền mặt']
  const [nameError, setNameError] = useState('')
  const [methodError, setmethodError] = useState('')
  const [isModalHuy, setIsModalHuy] = useState(false)

  const validateInputs = () => {
    let valid = true

    if (!name) {
      setNameError('Vui lòng chọn tên loại chứng từ.')
      valid = false
    } else {
      setNameError('')
    }

    if (!method) {
      setmethodError('Vui lòng chọn phương thức.')
      valid = false
    } else {
      setmethodError('')
    }

    return valid
  }

  const handleAddLoaiChungTu = async () => {
    if (validateInputs()) {
      try {
        const response = await fetch(
          `${getApiUrl('domain')}/postloaichungtu/${userID}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: name,
              method: method
            })
          }
        )

        if (response.ok) {
          fetchdata()
          handelsave()
          showToast('Thêm loại chứng từ thành công')
        } else {
          showToast('Thêm loại chứng từ thất bại', 'error')
          onClose()
        }
      } catch (error) {
        console.error('Lỗi khi gửi yêu cầu thêm loại chứng từ:', error)
        showToast('Thêm loại chứng từ thất bại', 'error')
        handleClose()
      }
    }
  }

  const resetForm = useCallback(() => {
    setName('')
    setmethod('')
    setNameError('')
    setmethodError('')
  }, [])

  const handelsave = () => {
    resetForm()
    onClose()
    setIsModalHuy(false)
  }

  const handleClose = () => {
    setIsModalHuy(true)
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className='divAddNhaCungCap'>
        <h2>Thêm loại chứng từ</h2>

        <div className='divtenkho'>
          <label htmlFor='' className='label'>
            Chọn tên loại chứng từ
          </label>
          <select
            value={name}
            onChange={e => {
              setName(e.target.value)
              setNameError('')
            }}
            className={`select-name ${nameError ? 'input-error' : ''}`}
          >
            <option value=''>-- Chọn loại chứng từ --</option>
            {names.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
          {nameError && <div className='error'>{nameError}</div>}
        </div>

        <div className='divdiachikho'>
          <label htmlFor='' className='label'>
            Chọn phương thức
          </label>
          <select
            value={method}
            onChange={e => {
              setmethod(e.target.value)
              setmethodError('')
            }}
            className={`select-method ${methodError ? 'input-error' : ''}`}
          >
            <option value=''>-- Chọn phương thức --</option>
            {methods.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
          {methodError && <div className='error'>{methodError}</div>}
        </div>

        <button onClick={handleAddLoaiChungTu} className='btnAddNhaCungCap'>
          Thêm loại chứng từ
        </button>
        <button onClick={handleClose} className='btnhuyAddNhaCungCap'>
          Hủy
        </button>
      </div>
      <ModalOnClose
        isOpen={isModalHuy}
        Save={handleAddLoaiChungTu}
        DontSave={handelsave}
        Cancel={() => setIsModalHuy(false)}
      />
    </Modal>
  )
}

export default AddLoaiChungTu
