/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback } from 'react'

import { Modal } from '~/components/Modal'
import { useToast } from '~/components/GlobalStyles/ToastContext'
import { ModalOnClose } from '~/components/ModalOnClose'
import { getApiUrl } from '~/api/api'

function AddNhomKhachHang ({ isOpen, onClose, userId, fetchdata }) {
  const [name, setName] = useState('')
  const { showToast } = useToast()
  const [nameError, setNameError] = useState('')

  const [isModalHuy, setIsModalHuy] = useState(false)
  const [isClickButton, setIsClickButton] = useState(false)

  const validateInputs = () => {
    let valid = true

    if (!name) {
      setNameError('Vui lòng nhập tên nhóm khách hàng.')
      valid = false
      setIsModalHuy(false)
    } else {
      setNameError('')
    }

    return valid
  }

  const handeladdnkh = async () => {
    if (validateInputs()) {
      setIsClickButton(true)
      try {
        const response = await fetch(
          `${getApiUrl('domain')}/postnhomkhachhang/${userId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: name
            })
          }
        )

        if (response.ok) {
          fetchdata()
          handelsave()
          setIsClickButton(false)
          showToast('Thêm nhóm khách hàng thành công')
        } else {
          showToast('Thêm nhóm khách hàng thất bại', 'error')
          onClose()
        }
      } catch (error) {
        console.error('Lỗi khi gửi yêu cầu Thêm nhóm khách hàng:', error)
        showToast('Thêm nhóm khách hàng thất bại', 'error')
      }
    }
  }

  const resetForm = useCallback(() => {
    setName('')
    setNameError('')
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
        <h2>Thêm nhóm khách hàng</h2>
        <div className='div_name_masku'>
          <label htmlFor=''>Nhập tên nhóm khách hàng</label>
          <div>
            <input
              type='text'
              className={`tenkho ${nameError ? 'input-error' : ''}`}
              placeholder='Tên nhóm khách hàng'
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
        </div>

        {nameError && <div className='error'>{nameError}</div>}

        <button
          onClick={handeladdnkh}
          className={
            isClickButton
              ? 'btnAddNhaCungCap btnadddisabled'
              : 'btnAddNhaCungCap'
          }
          disabled={isClickButton}
        >
          {isClickButton ? '...Đang tải dữ liệu' : 'Thêm nhóm khách hàng'}
        </button>
      </div>
      <ModalOnClose
        isOpen={isModalHuy}
        Save={handeladdnkh}
        DontSave={handelsave}
        Cancel={() => setIsModalHuy(false)}
      />
    </Modal>
  )
}

export default AddNhomKhachHang
