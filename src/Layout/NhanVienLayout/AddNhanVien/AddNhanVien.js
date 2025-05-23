import { useState, useCallback } from 'react'

import { Modal } from '../../../components/Modal'
import { useToast } from '../../../components/GlobalStyles/ToastContext'
import { ModalOnClose } from '~/components/ModalOnClose'
import { getApiUrl } from '../../../api/api'

function AddNhanVien ({ isOpen, onClose, khoID, fetchData }) {
  const [name, setName] = useState('')
  const [hovaten, sethovaten] = useState('')
  const [chucvu, setchucvu] = useState('')
  const [birthday, setbirthday] = useState('')
  const [password, setpassword] = useState('')

  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const { showToast } = useToast()
  const [nameError, setNameError] = useState('')
  const [hovatenError, sethovatenError] = useState('')
  const [chucvuError, setchucvuError] = useState('')
  const [birthdayError, setbirthdayError] = useState('')
  const [passwordError, setpasswordError] = useState('')

  const [emailError, setEmailError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [isModalHuy, setIsModalHuy] = useState(false)

  const validateInputs = () => {
    let valid = true

    if (!name) {
      setNameError('Vui lòng nhập tên nhân viên.')
      valid = false
    } else {
      setNameError('')
    }
    if (!hovaten) {
      sethovatenError('Vui lòng nhập họ tên.')
      valid = false
    } else {
      sethovatenError('')
    }
    if (!chucvu) {
      setchucvuError('Vui lòng nhập chức vụ.')
      valid = false
    } else {
      setchucvuError('')
    }
    if (!birthday) {
      setbirthdayError('Vui lòng chọn ngày sinh.')
      valid = false
    } else {
      setbirthdayError('')
    }
    if (!password) {
      setpasswordError('Vui lòng nhập mật khẩu.')
      valid = false
    } else {
      setpasswordError('')
    }

    if (email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setEmailError('Email không hợp lệ.')
        valid = false
      } else {
        setEmailError('')
      }
    }

    if (!phone) {
      setPhoneError('Vui lòng nhập số điện thoại.')
      valid = false
    } else if (!/^\d{10,11}$/.test(phone)) {
      setPhoneError('Số điện thoại phải 10 hoặc 11 số.')
      valid = false
    } else {
      setPhoneError('')
    }

    return valid
  }

  const handleAddnhanvien = async () => {
    if (validateInputs()) {
      try {
        const response = await fetch(
          `${getApiUrl('domain')}/postnhanvien/${khoID}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: name,
              phone: phone,
              email: email,
              birthday,
              hovaten,
              chucvu,
              password
            })
          }
        )

        if (response.ok) {
          fetchData()
          handelsave()
          showToast('Thêm nhân viên thành công')
        } else {
          showToast('Thêm nhân viên thất bại', 'error')
          onClose()
        }
      } catch (error) {
        console.error('Lỗi khi gửi yêu cầu thêm nhân viên:', error)
        showToast('Thêm nhân viên thất bại', 'error')
        handleClose()
      }
    }
  }

  const resetForm = useCallback(() => {
    setName('')
    setEmail('')
    setPhone('')
    setbirthday('')
    setpassword('')
    sethovaten('')
    setchucvu('')
    setNameError('')
    setEmailError('')
    setPhoneError('')
    setbirthdayError('')
    setpasswordError('')
    sethovatenError('')
    setchucvuError('')
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
        <h2>Thêm nhân viên</h2>
        <div className='divtenkho'>
          <input
            type='text'
            className={`tenkho ${hovatenError ? 'input-error' : ''}`}
            placeholder=''
            value={hovaten}
            onChange={e => {
              sethovaten(e.target.value)
              sethovatenError('')
            }}
          />
          <label htmlFor='' className='label'>
            Nhập họ và tên nhân viên (*)
          </label>
        </div>
        {hovatenError && <div className='error'>{hovatenError}</div>}
        <div className='divtenkho'>
          <input
            type='date'
            className={`tenkho ${birthdayError ? 'input-error' : ''}`}
            placeholder=''
            value={birthday}
            onChange={e => {
              setbirthday(e.target.value)
              setbirthdayError('')
            }}
          />
          <label htmlFor='' className='label'>
            Nhập ngày tháng năm sinh (*)
          </label>
        </div>
        {birthdayError && <div className='error'>{birthdayError}</div>}
        <div className='divtenkho'>
          <input
            type='text'
            className={`tenkho ${chucvuError ? 'input-error' : ''}`}
            placeholder=''
            value={chucvu}
            onChange={e => {
              setchucvu(e.target.value)
              setchucvuError('')
            }}
          />
          <label htmlFor='' className='label'>
            Nhập chức vụ (*)
          </label>
        </div>
        {chucvuError && <div className='error'>{chucvuError}</div>}

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
            Nhập tên tài khoản nhân viên (*)
          </label>
        </div>
        {nameError && <div className='error'>{nameError}</div>}

        <div className='divdiachikho'>
          <input
            type='text'
            className={`diachi ${phoneError ? 'input-error' : ''}`}
            placeholder=''
            value={phone}
            onChange={e => {
              setPhone(e.target.value)
              setPhoneError('')
            }}
          />
          <label htmlFor='' className='label'>
            Nhập số điện thoại (*)
          </label>
        </div>
        {phoneError && <div className='error'>{phoneError}</div>}

        <div className='divdiachikho'>
          <input
            type='text'
            className={`diachi ${emailError ? 'input-error' : ''}`}
            placeholder=''
            value={email}
            onChange={e => {
              setEmail(e.target.value)
              setEmailError('')
            }}
          />
          <label htmlFor='' className='label'>
            Nhập email
          </label>
        </div>
        {emailError && <div className='error'>{emailError}</div>}

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
            Nhập mật khẩu tài khoản (*)
          </label>
        </div>
        {passwordError && <div className='error'>{passwordError}</div>}

        <button onClick={handleAddnhanvien} className='btnAddNhaCungCap'>
          Thêm nhân viên
        </button>
        <button onClick={handleClose} className='btnhuyAddNhaCungCap'>
          Hủy
        </button>
      </div>
      <ModalOnClose
        isOpen={isModalHuy}
        Save={handleAddnhanvien}
        DontSave={handelsave}
        Cancel={() => setIsModalHuy(false)}
      />
    </Modal>
  )
}

export default AddNhanVien
