/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useEffect } from 'react'

import { Modal } from '~/components/Modal'
import { useToast } from '~/components/GlobalStyles/ToastContext'
import './AddKhachHang.scss'

function AddKhachHang ({ isOpen, onClose, khoID, fetchData, userId }) {
  const [nhomkhachhangs, setnhomkhachangs] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [date, setDate] = useState('')
  const [cancuoc, setCancuoc] = useState('')
  const [nhomkhachhangID, setNhomkhachhangID] = useState('')
  const [nhomkhachangname, setnhomkhachangname] = useState('')

  const { showToast } = useToast()
  const [nameError, setNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [addressError, setAddressError] = useState('')
  const [dateError, setDateError] = useState('')
  const [cancuocError, setCancuocError] = useState('')

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
    } else if (!/^\d{10}$/.test(phone)) {
      setPhoneError('Số điện thoại phải 10 số.')
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

    if (!date) {
      setDateError('Vui lòng nhập ngày tháng năm sinh.')
      valid = false
    } else {
      setDateError('')
    }
    if (!cancuoc) {
      setCancuocError('Vui lòng nhập căn cước công dân.')
      valid = false
    } else {
      setCancuocError('')
    }

    return valid
  }

  const fetchnhomkhachang = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/getnhomkhachhang/${userId}`
      )
      const data = await response.json()

      if (response.ok) {
        setnhomkhachangs(data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchnhomkhachang()
  }, [userId])

  const handleAddKhachHang = async () => {
    if (validateInputs()) {
      try {
        const response = await fetch(
          `https://ansuataohanoi.com/postkhachhang/${khoID}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: name,
              phone: phone,
              email: email,
              address: address,
              cancuoc: cancuoc,
              date: date,
              nhomkhachhang: nhomkhachhangID
            })
          }
        )

        if (response.ok) {
          fetchData()
          handleClose()
          showToast('Thêm khách hàng thành công')
        } else {
          showToast('Thêm khách hàng thất bại', 'error')
          onClose()
        }
      } catch (error) {
        console.error('Lỗi khi gửi yêu cầu thêm khách hàng:', error)
        showToast('Thêm khách hàng thất bại', 'error')
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
    setDate('')
    setCancuoc('')
  }, [])

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className='divAddKhachHang'>
        <h2>Thêm khách hàng</h2>
        <div className='divnhomkhachhang'>
          <label htmlFor='nhomkhachhang' className='labelnhomkhachHang'>
            Chọn nhóm khách hàng
          </label>
          <select
            id='nhomkhachhang'
            className='select-nhomkhachhang'
            value={nhomkhachangname}
            onChange={e => {
              const selectedname = e.target.value
              const selectedGroup = nhomkhachhangs.find(
                nhom => nhom.name === selectedname
              )
              setNhomkhachhangID(selectedGroup._id)
              setnhomkhachangname(selectedname)
            }}
          >
            <option value='' disabled>
              -- Chọn nhóm khách hàng --
            </option>
            {nhomkhachhangs.map(nhom => (
              <option key={nhom._id} value={nhom.name}>
                {nhom.name}
              </option>
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
            Nhập tên khách hàng
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
            type='email'
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
        <div className='divdiachikho'>
          <input
            type='text'
            className={`diachi ${cancuocError ? 'input-error' : ''}`}
            placeholder=''
            value={cancuoc}
            onChange={e => {
              setCancuoc(e.target.value)
              setCancuocError('')
            }}
          />
          <label htmlFor='' className='label'>
            Nhập căn cước công dân
          </label>
        </div>
        {cancuocError && <div className='error'>{cancuocError}</div>}

        <div className='divdiachikho'>
          <input
            type='date'
            className={`diachi ${dateError ? 'input-error' : ''}`}
            placeholder=''
            value={date}
            onChange={e => {
              setDate(e.target.value)
              setDateError('')
            }}
            max={new Date().toISOString().split('T')[0]}
          />
          <label htmlFor='' className='label'>
            Ngày tháng năm sinh
          </label>
        </div>
        {cancuocError && <div className='error'>{cancuocError}</div>}

        <button onClick={handleAddKhachHang} className='btnAddKhachHang'>
          Thêm khách hàng
        </button>
        <button onClick={handleClose} className='btnhuyAddKhachHang'>
          Hủy
        </button>
      </div>
    </Modal>
  )
}

export default AddKhachHang
