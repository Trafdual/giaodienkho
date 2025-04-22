/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useEffect } from 'react'

import { Modal } from '~/components/Modal'
import { useToast } from '~/components/GlobalStyles/ToastContext'
import { ModalOnClose } from '~/components/ModalOnClose'
import { getApiUrl } from '../../../../api/api'

function EditLoaiChungTu ({ isOpen, onClose, idloaichungtu, fetchdata }) {
  const [name, setName] = useState('')
  const [method, setmethod] = useState('')

  const { showToast } = useToast()
  const names = ['Phiếu chi', 'Phiếu thu']
  const methods = ['Tiền gửi', 'Tiền mặt']
  const [nameError, setNameError] = useState('')
  const [methodError, setmethodError] = useState('')
  const [isModalHuy, setIsModalHuy] = useState(false)

  const fetchchittiet = async () => {
    try {
      const response = await fetch(
        `${getApiUrl('domain')}/getchitietloaichungtu/${idloaichungtu}`
      )
      const data = await response.json()
      if (response.ok) {
        setName(data.name)
        setmethod(data.method)
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu Cập nhật loại chứng từ:', error)
      showToast('Cập nhật loại chứng từ thất bại', 'error')
      handleClose()
    }
  }

  useEffect(() => {
    if (isOpen && idloaichungtu) {
      fetchchittiet()
    }
  }, [isOpen, idloaichungtu])

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

  const handleEditLoaiChungTu = async () => {
    if (validateInputs()) {
      try {
        const response = await fetch(
          `${getApiUrl('domain')}/postloaichungtu/${idloaichungtu}`,
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
          showToast('Cập nhật loại chứng từ thành công')
        } else {
          showToast('Cập nhật loại chứng từ thất bại', 'error')
          onClose()
        }
      } catch (error) {
        console.error('Lỗi khi gửi yêu cầu Cập nhật loại chứng từ:', error)
        showToast('Cập nhật loại chứng từ thất bại', 'error')
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
        <h2>Cập nhật loại chứng từ</h2>

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

        <button onClick={handleEditLoaiChungTu} className='btnAddNhaCungCap'>
          Cập nhật loại chứng từ
        </button>
        <button onClick={handleClose} className='btnhuyAddNhaCungCap'>
          Hủy
        </button>
      </div>
      <ModalOnClose
        isOpen={isModalHuy}
        Save={handleEditLoaiChungTu}
        DontSave={handelsave}
        Cancel={() => setIsModalHuy(false)}
      />
    </Modal>
  )
}

export default EditLoaiChungTu
