/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useEffect } from 'react'

import { Modal } from '~/components/Modal'
import { useToast } from '~/components/GlobalStyles/ToastContext'
import { ModalOnClose } from '~/components/ModalOnClose'
import { getApiUrl } from '~/api/api'

function EditSku ({ isOpen, onClose, idsku, fetchsku }) {
  const [name, setName] = useState('')
  const { showToast } = useToast()
  const [nameError, setNameError] = useState('')

  const [isModalHuy, setIsModalHuy] = useState(false)
  const [isClickButton, setIsClickButton] = useState(false)

  const fetchchitiet = async () => {
    try {
      const response = await fetch(
        `${getApiUrl('domain')}/getchitietsku/${idsku}`
      )
      const data = await response.json()
      if (response.ok) {
        setName(data.name)
      }
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết sku:', error)
      showToast('lấy chi tiết sku thất bại', 'error')
    }
  }

  useEffect(() => {
    if (isOpen && idsku) {
      fetchchitiet()
    }
  }, [isOpen, idsku])

  const validateInputs = () => {
    let valid = true

    if (!name) {
      setNameError('Vui lòng nhập tên sku.')
      valid = false
      setIsModalHuy(false)
    } else {
      setNameError('')
    }

    return valid
  }

  const handleAddSku = async () => {
    if (validateInputs()) {
      setIsClickButton(true)
      try {
        const response = await fetch(
          `${getApiUrl('domain')}/updatesku/${idsku}`,
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
          fetchsku()
          handelsave()
          setIsClickButton(false)
          showToast('Cập nhật sku thành công')
        } else {
          showToast('Cập nhật sku thất bại', 'error')
          onClose()
        }
      } catch (error) {
        console.error('Lỗi khi gửi yêu cầu Cập nhật sku:', error)
        showToast('Cập nhật sku thất bại', 'error')
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
        <h2>Cập nhật Sku</h2>
        <div className='div_name_masku'>
          <label htmlFor=''>Nhập tên sản phẩm</label>
          <div>
            <input
              type='text'
              className={`tenkho ${nameError ? 'input-error' : ''}`}
              placeholder='VD: 12 pro max'
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
        </div>

        {nameError && <div className='error'>{nameError}</div>}

        <button
          onClick={handleAddSku}
          className={
            isClickButton
              ? 'btnAddNhaCungCap btnadddisabled'
              : 'btnAddNhaCungCap'
          }
          disabled={isClickButton}
        >
          {isClickButton ? '...Đang tải dữ liệu' : 'Cập nhật Sku'}
        </button>
      </div>
      <ModalOnClose
        isOpen={isModalHuy}
        Save={handleAddSku}
        DontSave={handelsave}
        Cancel={() => setIsModalHuy(false)}
      />
    </Modal>
  )
}

export default EditSku
