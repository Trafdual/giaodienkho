import { useState, useCallback } from 'react'

import { Modal } from '../../../components/Modal'
import { useToast } from '../../../components/GlobalStyles/ToastContext'

function AddLoHang ({ isOpen, onClose, setlohang }) {
  const [name, setName] = useState('')
  const [soluong, setsoluong] = useState('')
  const [tongtien, settongtien] = useState('')
  const [date, setdate] = useState('')
  const [mancc, setmancc] = useState('')

  const { showToast } = useToast()
  const [nameError, setNameError] = useState('')
  const [soluongError, setsoluongError] = useState('')
  const [tongtienError, settongtienError] = useState('')
  const [dateError, setdateError] = useState('')
  const [manccError, setmanccError] = useState('')

  const validateInputs = () => {
    let valid = true

    if (!name) {
      setNameError('Vui lòng nhập tên nhà cung cấp.')
      valid = false
    } else {
      setNameError('')
    }

    if (!soluong) {
      setsoluongError('Vui lòng nhập soluong.')
      valid = false
    } else {
      setsoluongError('')
    }

    if (!tongtien) {
      settongtienError('Vui lòng nhập số điện thoại.')
      valid = false
    } else {
      settongtienError('')
    }

    if (!date) {
      setdateError('Vui lòng nhập ngày nhập lô hàng.')
      valid = false
    } else {
      setdateError('')
    }
    if (!mancc) {
      setdateError('Vui lòng nhập ngày nhập mã nhà cung cấp.')
      valid = false
    } else {
      setdateError('')
    }

    return valid
  }

  const handleAddLoHang = async () => {
    if (validateInputs()) {
      try {
        const response = await fetch(`http://localhost:8080/postloaisanpham2`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            mancc:mancc,
            name: name,
            tongtien: tongtien,
            soluong: soluong,
            date: date
          })
        })
        const data = await response.json()

        if (response.ok) {
          setlohang(prevlohang => [...prevlohang, data])
          handleClose()
          showToast('Thêm lô hàng thành công')
        } else {
          showToast('Thêm lô hàng thất bại', 'error')
          onClose()
        }
      } catch (error) {
        console.error('Lỗi khi gửi yêu cầu thêm lô hàng:', error)
        showToast('Thêm lô hàng thất bại', 'error')
        handleClose()
      }
    }
  }

  const resetForm = useCallback(() => {
    setName('')
    setsoluong('')
    settongtien('')
    setdate('')
    setmancc('')
    setNameError('')
    setsoluongError('')
    settongtienError('')
    setdateError('')
    setmanccError('')
  }, [])

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className='divAddLoHang'>
        <h2>Thêm lô hàng</h2>
        <div className='divtenkho'>
          <input
            type='text'
            className={`tenkho ${manccError ? 'input-error' : ''}`}
            placeholder=''
            value={mancc}
            onChange={e => setmancc(e.target.value)}
          />
          <label htmlFor='' className='label'>
            Nhập mã nhà cung cấp
          </label>
        </div>
        {manccError && <div className='error'>{manccError}</div>}

        <div className='divtenkho'>
          <input
            type='text'
            className={`tenkho ${nameError ? 'input-error' : ''}`}
            placeholder=''
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <label htmlFor='' className='label'>
            Nhập tên lô hàng
          </label>
        </div>
        {nameError && <div className='error'>{nameError}</div>}

        <div className='divdiachikho'>
          <input
            type='text'
            className={`diachi ${soluongError ? 'input-error' : ''}`}
            placeholder=''
            value={soluong}
            onChange={e => setsoluong(e.target.value)}
          />
          <label htmlFor='' className='label'>
            Nhập số lượng máy
          </label>
        </div>
        {soluongError && <div className='error'>{soluongError}</div>}

        <div className='divdiachikho'>
          <input
            type='text'
            className={`diachi ${tongtienError ? 'input-error' : ''}`}
            placeholder=''
            value={tongtien}
            onChange={e => settongtien(e.target.value)}
          />
          <label htmlFor='' className='label'>
            Nhập tổng tiền lô hàng
          </label>
        </div>
        {tongtienError && <div className='error'>{tongtienError}</div>}

        <div className='divdiachikho'>
          <input
            type='text'
            className={`diachi ${dateError ? 'input-error' : ''}`}
            placeholder=''
            value={date}
            onChange={e => setdate(e.target.value)}
          />
          <label htmlFor='' className='label'>
            Ngày nhập dd/mm/yyyy
          </label>
        </div>
        {dateError && <div className='error'>{dateError}</div>}

        <button onClick={handleAddLoHang} className='btnAddLoHang'>
          Thêm lô hàng
        </button>
        <button onClick={handleClose} className='btnhuyAddLoHang'>
          Hủy
        </button>
      </div>
    </Modal>
  )
}

export default AddLoHang
