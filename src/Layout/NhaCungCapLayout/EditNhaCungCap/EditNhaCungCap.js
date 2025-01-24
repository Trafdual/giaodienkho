/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useEffect } from 'react'

import { Modal } from '../../../components/Modal'
import { useToast } from '../../../components/GlobalStyles/ToastContext'
import { ModalOnClose } from '~/components/ModalOnClose'

function EditNhaCungCap ({ isOpen, onClose, idncc, fetchdata, setidncc }) {
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

  const validateInputs = () => {
    let valid = true

    if (!name) {
      setNameError('Vui lòng nhập tên nhà cung cấp.')
      valid = false
    } else {
      setNameError('')
    }

    if (!email) {
      setEmailError('Vui lòng nhập email.')
      valid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Email không hợp lệ.')
      valid = false
    } else {
      setEmailError('')
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

    if (!address) {
      setAddressError('Vui lòng nhập địa chỉ.')
      valid = false
    } else {
      setAddressError('')
    }

    return valid
  }
  const fetchchitiet = async () => {
    try {
      const response = await fetch(
        `https://ansuataohanoi.com/getchitietncc/${idncc}`
      )
      const data = await response.json()
      if (response.ok) {
        setName(data.name)
        setEmail(data.email)
        setPhone(data.phone)
        setAddress(data.address)
      }
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    if (idncc) {
      fetchchitiet()
    }
  }, [idncc])

  const handleEditNhaCungCap = async () => {
    if (validateInputs()) {
      try {
        const response = await fetch(
<<<<<<< HEAD
          `https:/ansuataohanoi.com/editnhacungcap/${idncc}`,
=======
          `https://ansuataohanoi.com/editnhacungcap/${idncc}`,
>>>>>>> 988350495b3608450c314b52aa09b669a0ce0a24
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
          fetchdata()
          handelsave()
          showToast('Cập nhật nhà cung cấp thành công')
        } else {
          showToast('Cập nhật nhà cung cấp thất bại', 'error')
          onClose()
        }
      } catch (error) {
        console.error('Lỗi khi gửi yêu cầu Cập nhật nhà cung cấp:', error)
        showToast('Cập nhật nhà cung cấp thất bại', 'error')
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
    setidncc('')
  }

  const handleClose = () => {
    setIsModalHuy(true)
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className='divAddNhaCungCap'>
        <h2>Cập nhật nhà cung cấp</h2>
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

        <button onClick={handleEditNhaCungCap} className='btnAddNhaCungCap'>
          Cập nhật nhà cung cấp
        </button>
        <button onClick={handleClose} className='btnhuyAddNhaCungCap'>
          Hủy
        </button>
      </div>
      <ModalOnClose
        isOpen={isModalHuy}
        Save={handleEditNhaCungCap}
        DontSave={handelsave}
        Cancel={() => setIsModalHuy(false)}
      />
    </Modal>
  )
}

export default EditNhaCungCap
