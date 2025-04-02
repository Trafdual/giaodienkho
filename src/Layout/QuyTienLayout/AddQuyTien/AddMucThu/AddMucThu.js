import { useState, useCallback } from 'react'

import { Modal } from '~/components/Modal'
import { useToast } from '~/components/GlobalStyles/ToastContext'
import { ModalOnClose } from '~/components/ModalOnClose'
import { getApiUrl } from '../../../../api/api'

function AddMucThu ({ isOpen, onClose, userId, fetchdata, loaitien }) {
  const [name, setName] = useState('')

  const { showToast } = useToast()
  const [nameError, setNameError] = useState('')
  const [isModalHuy, setIsModalHuy] = useState(false)

  const validateInputs = () => {
    let valid = true

    if (!name) {
      setNameError('Vui lòng nhập tên mục thu chi')
      valid = false
    } else {
      setNameError('')
    }
    return valid
  }

  const handleAddMucThu = async () => {
    if (validateInputs()) {
      try {
        const response = await fetch(
          `${getApiUrl('domain')}/postmucthuchi/${userId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: name,
              loaimuc: loaitien
            })
          }
        )

        if (response.ok) {
          fetchdata()
          handelsave()
          showToast('Thêm mục thu chi thành công')
        } else {
          showToast('Thêm mục thu chi thất bại', 'error')
          onClose()
        }
      } catch (error) {
        console.error('Lỗi khi gửi yêu cầu thêm mục thu chi:', error)
        showToast('Thêm mục thu chi thất bại', 'error')
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
        <h2>Thêm Mục thu chi</h2>
        <div className='divtenkho'>
          <input
            type='text'
            className={`tenkho ${nameError ? 'input-error' : ''}`}
            placeholder=''
            value={name}
            onChange={e => {
              setName(e.target.value)
              setNameError('')
            }}
          />
          <label htmlFor='' className='label'>
            Nhập tên mục thu
          </label>
        </div>
        {nameError && <div className='error'>{nameError}</div>}

        <button onClick={handleAddMucThu} className='btnAddNhaCungCap'>
          Thêm Mục thu chi
        </button>
        <button onClick={handleClose} className='btnhuyAddNhaCungCap'>
          Hủy
        </button>
      </div>
      <ModalOnClose
        isOpen={isModalHuy}
        Save={handleAddMucThu}
        DontSave={handelsave}
        Cancel={() => setIsModalHuy(false)}
      />
    </Modal>
  )
}

export default AddMucThu
