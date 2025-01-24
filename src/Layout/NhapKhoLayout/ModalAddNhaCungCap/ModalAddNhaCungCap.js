import { useState, useCallback } from 'react'

import { Modal } from '../../../components/Modal'
import { useToast } from '../../../components/GlobalStyles/ToastContext'
import { ModalOnClose } from '~/components/ModalOnClose'
import './ModalAddNhaCungCap.scss'

function ModalAddNhaCungCap ({ isOpen, onClose, khoID, fetchnhacungcap }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')

  const { showToast } = useToast()
  const [nameError, setNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [addressError, setAddressError] = useState('')
  const [isModalHuy, setIsModalHuy] = useState(false)
  const [isClickButton, setIsClickButton] = useState(false)

  const validateInputs = () => {
    let valid = true

    if (!name) {
      setNameError('Vui lòng nhập tên nhà cung cấp.')
      valid = false
      setIsModalHuy(false)
    } else {
      setNameError('')
    }

    if (!email) {
      setEmailError('Vui lòng nhập email.')
      valid = false
      setIsModalHuy(false)
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Email không hợp lệ.')
      valid = false
      setIsModalHuy(false)
    } else {
      setEmailError('')
    }

    if (!phone) {
      setPhoneError('Vui lòng nhập số điện thoại.')
      valid = false
      setIsModalHuy(false)
    } else if (!/^\d{10,11}$/.test(phone)) {
      setPhoneError('Số điện thoại phải 10 hoặc 11 số.')
      valid = false
      setIsModalHuy(false)
    } else {
      setPhoneError('')
    }

    if (!address) {
      setAddressError('Vui lòng nhập địa chỉ.')
      valid = false
      setIsModalHuy(false)
    } else {
      setAddressError('')
    }

    return valid
  }

  const handleAddNhaCungCap = async () => {
    if (validateInputs()) {
      setIsClickButton(true)
      try {
        const response = await fetch(
          `https://ansuataohanoi.com/postnhacungcap/${khoID}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: name,
              phone: phone,
              email: email,
              address: address
            })
          }
        )

        if (response.ok) {
          fetchnhacungcap()
          handelsave()
          setIsClickButton(false)
          showToast('Thêm nhà cung cấp thành công')
        } else {
          showToast('Thêm nhà cung cấp thất bại', 'error')
          onClose()
        }
      } catch (error) {
        console.error('Lỗi khi gửi yêu cầu thêm nhà cung cấp:', error)
        showToast('Thêm nhà cung cấp thất bại', 'error')
        handleClose()
      }
    }
  }

  const resetForm = useCallback(() => {
    setName('')
    setEmail('')
    setPhone('')
    setAddress('')
    setNameError('')
    setEmailError('')
    setPhoneError('')
    setAddressError('')
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
        <h2>Thêm nhà cung cấp</h2>
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
            Nhập tên nhà cung cấp
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
            Nhập số điện thoại
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

        <div className='divdiachikho'>
          <input
            type='text'
            className={`diachi ${addressError ? 'input-error' : ''}`}
            placeholder=''
            value={address}
            onChange={e => {
              setAddress(e.target.value)
              setAddressError('')
            }}
          />
          <label htmlFor='' className='label'>
            Nhập địa chỉ
          </label>
        </div>
        {addressError && <div className='error'>{addressError}</div>}

        <button
          onClick={handleAddNhaCungCap}
          className={
            isClickButton
              ? 'btnAddNhaCungCap btnadddisabled'
              : 'btnAddNhaCungCap'
          }
          disabled={isClickButton}
        >
          {isClickButton ? '...Đang tải dữ liệu' : 'Thêm nhà cung cấp'}
        </button>
      </div>
      <ModalOnClose
        isOpen={isModalHuy}
        Save={handleAddNhaCungCap}
        DontSave={handelsave}
        Cancel={() => setIsModalHuy(false)}
      />
    </Modal>
  )
}

export default ModalAddNhaCungCap
