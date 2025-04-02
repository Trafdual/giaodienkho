/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useEffect } from 'react'

import { Modal } from '../../../components/Modal'
import { useToast } from '../../../components/GlobalStyles/ToastContext'
import { ModalOnClose } from '~/components/ModalOnClose'
import { getApiUrl } from '../../../api/api'

function EditPassword ({ isOpen, onClose, idncc, fetchdata }) {
  const [password, setpassword] = useState('')

  const { showToast } = useToast()

  const [passwordError, setpasswordError] = useState('')

  const [isModalHuy, setIsModalHuy] = useState(false)

  const validateInputs = () => {
    let valid = true

    if (!password) {
      setpasswordError('Vui lòng nhập mật khẩu.')
      valid = false
    } else {
      setpasswordError('')
    }

    return valid
  }

  const fetchchitiet = async () => {
    try {
      const response = await fetch(`${getApiUrl('domain')}/chitietnv/${idncc}`)
      const data = await response.json()

      if (response.ok) {
        setpassword(data.password)
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu lấy chi tiết mật khẩu:', error)
    }
  }
  useEffect(() => {
    if (isOpen && idncc) {
      fetchchitiet()
    }
  }, [idncc, isOpen])

  const handleEditNhanVien = async () => {
    if (validateInputs()) {
      try {
        const response = await fetch(
          `${getApiUrl('domain')}/doimknv/${idncc}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              password
            })
          }
        )

        if (response.ok) {
          fetchdata()
          handelsave()
          showToast('Cập nhật mật khẩu thành công')
        } else {
          showToast('Cập nhật mật khẩu thất bại', 'error')
          onClose()
        }
      } catch (error) {
        console.error('Lỗi khi gửi yêu cầu Cập nhật mật khẩu:', error)
        showToast('Cập nhật mật khẩu thất bại', 'error')
        handleClose()
      }
    }
  }

  const resetForm = useCallback(() => {
    setpassword('')
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
        <h2>Cập nhật mật khẩu</h2>

        <div className='divtenkho'>
          <input
            type='text'
            className={`tenkho ${passwordError ? 'input-error' : ''}`}
            placeholder=''
            value={password}
            onChange={e => {
              setpassword(e.target.value)
              setpasswordError('')
            }}
          />
          <label htmlFor='' className='label'>
            Nhập mật khẩu mới
          </label>
        </div>
        {passwordError && <div className='error'>{passwordError}</div>}

        <button onClick={handleEditNhanVien} className='btnAddNhaCungCap'>
          Cập nhật mật khẩu
        </button>
        <button onClick={handleClose} className='btnhuyAddNhaCungCap'>
          Hủy
        </button>
      </div>
      <ModalOnClose
        isOpen={isModalHuy}
        Save={handleEditNhanVien}
        DontSave={handelsave}
        Cancel={() => setIsModalHuy(false)}
      />
    </Modal>
  )
}

export default EditPassword
