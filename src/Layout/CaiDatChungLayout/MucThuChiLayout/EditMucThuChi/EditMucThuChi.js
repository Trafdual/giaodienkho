/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useEffect } from 'react'

import { Modal } from '~/components/Modal'
import { useToast } from '~/components/GlobalStyles/ToastContext'
import { ModalOnClose } from '~/components/ModalOnClose'
import { getApiUrl } from '../../../../api/api'

function EditMucThuChi ({ isOpen, onClose, idmucthuchi, fetchdata }) {
  const [name, setName] = useState('')
  const [loaimuc, setloaimuc] = useState('')
  const { showToast } = useToast()
  const [nameError, setNameError] = useState('')
  const [isModalHuy, setIsModalHuy] = useState(false)
  const loaimucs = ['Tiền thu', 'Tiền chi']

  const fetchchitiet = async () => {
    try {
      const response = await fetch(
        `${getApiUrl('domain')}/getchittietmuctc/${idmucthuchi}`
      )
      const data = await response.json()
      if (response.ok) {
        setName(data.name)
        setloaimuc(data.loaimuc)
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu lấy chi tiết mục thu chi:', error)
      showToast('lấy chi tiết mục thu chi thất bại', 'error')
    }
  }

  useEffect(() => {
    if (isOpen && idmucthuchi) {
      fetchchitiet()
    }
  }, [isOpen, idmucthuchi])

  const validateInputs = () => {
    let valid = true

    if (!name) {
      setNameError('Vui lòng nhập tên mục thu chi')
      showToast('Vui lòng nhập tên mục thu chi', 'error')
      valid = false
    } else {
      setNameError('')
    }
    if (!loaimuc) {
      setNameError('Vui lòng chọn loại mục')
      showToast('Vui lòng chọn loại mục', 'error')
      valid = false
    } else {
      setNameError('')
    }

    return valid
  }

  const handleEditMucThuChi = async () => {
    if (validateInputs()) {
      try {
        const response = await fetch(
          `${getApiUrl('domain')}/updatemuctc/${idmucthuchi}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: name,
              loaimuc
            })
          }
        )

        if (response.ok) {
          fetchdata()
          handelsave()
          showToast('cập nhật mục thu chi thành công')
        } else {
          showToast('cập nhật mục thu chi thất bại', 'error')
          onClose()
        }
      } catch (error) {
        console.error('Lỗi khi gửi yêu cầu cập nhật mục thu chi:', error)
        showToast('cập nhật mục thu chi thất bại', 'error')
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
        <h2>Cập nhật Mục thu chi</h2>

        <div className='divnhomkhachhang'>
          <label htmlFor='nhomkhachhang' className='labelnhomkhachHang'>
            Chọn loại mục
          </label>
          <select
            id='nhomkhachhang'
            className='select-nhomkhachhang'
            value={loaimuc}
            onChange={e => {
              const selectedname = e.target.value

              setloaimuc(selectedname)
            }}
          >
            <option value='' disabled>
              -- Chọn loại mục --
            </option>
            {loaimucs.map(nhom => (
              <option value={nhom}>{nhom}</option>
            ))}
          </select>
        </div>

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

        <button onClick={handleEditMucThuChi} className='btnAddNhaCungCap'>
          Cập nhật Mục thu chi
        </button>
        <button onClick={handleClose} className='btnhuyAddNhaCungCap'>
          Hủy
        </button>
      </div>
      <ModalOnClose
        isOpen={isModalHuy}
        Save={handleEditMucThuChi}
        DontSave={handelsave}
        Cancel={() => setIsModalHuy(false)}
      />
    </Modal>
  )
}

export default EditMucThuChi
