/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useEffect } from 'react'

import { Modal } from '~/components/Modal'
import { useToast } from '~/components/GlobalStyles/ToastContext'
import { ModalOnClose } from '~/components/ModalOnClose'
import { getApiUrl } from '~/api/api'

function EditNhomKhachHang ({ isOpen, onClose, idnkh, fetchdata }) {
  const [name, setName] = useState('')
  const { showToast } = useToast()
  const [nameError, setNameError] = useState('')

  const [isModalHuy, setIsModalHuy] = useState(false)
  const [isClickButton, setIsClickButton] = useState(false)

  const fetchchitiet = async () => {
    try {
      const response = await fetch(`${getApiUrl('domain')}/getchitietnkh/${idnkh}`)
      const data = await response.json()
      if (response.ok) {
        setName(data.name)
      }
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết nhóm khách hàng:', error)
      showToast('lấy chi tiết nhóm khách hàng thất bại', 'error')
    }
  }

  useEffect(() => {
    if (isOpen && idnkh) {
      fetchchitiet()
    }
  }, [isOpen, idnkh])

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

  const handleeditnkh = async () => {
    if (validateInputs()) {
      setIsClickButton(true)
      try {
        const response = await fetch(
          `${getApiUrl('domain')}/updatenhomkh/${idnkh}`,
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
          showToast('Cập nhật nhóm khách hàng thành công')
        } else {
          showToast('Cập nhật nhóm khách hàng thất bại', 'error')
          onClose()
        }
      } catch (error) {
        console.error('Lỗi khi gửi yêu cầu Cập nhật nhóm khách hàng:', error)
        showToast('Cập nhật nhóm khách hàng thất bại', 'error')
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
        <h2>Cập nhật nhóm khách hàng</h2>
        <div className='div_name_masku'>
          <label htmlFor=''>Nhập tên nhóm khách hàng</label>
          <div>
            <input
              type='text'
              className={`tenkho ${nameError ? 'input-error' : ''}`}
              placeholder='tên nhóm khách hàng'
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
        </div>

        {nameError && <div className='error'>{nameError}</div>}

        <button
          onClick={handleeditnkh}
          className={
            isClickButton
              ? 'btnAddNhaCungCap btnadddisabled'
              : 'btnAddNhaCungCap'
          }
          disabled={isClickButton}
        >
          {isClickButton ? '...Đang tải dữ liệu' : 'Cập nhật nhóm khách hàng'}
        </button>
      </div>
      <ModalOnClose
        isOpen={isModalHuy}
        Save={handleeditnkh}
        DontSave={handelsave}
        Cancel={() => setIsModalHuy(false)}
      />
    </Modal>
  )
}

export default EditNhomKhachHang
