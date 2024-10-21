/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback,useEffect } from 'react'

import { Modal } from '../../../../../components/Modal'
import { useToast } from '../../../../../components/GlobalStyles/ToastContext'

function FormAddTay ({ isOpen, onClose, loaispid, fetchData,fetchlohang }) {
  const [name, setName] = useState('')
  const [imel, setimel] = useState('')
  const [dungluong, setdungluong] = useState('')
  const [color, setcolor] = useState('')

  const { showToast } = useToast()
  const [nameError, setNameError] = useState('')
  const [imelError, setimelError] = useState('')
  const [dungluongError, setdungluongError] = useState('')
  const [colorError, setcolorError] = useState('')

  const valicolorInputs = () => {
    let valid = true

    if (!name) {
      setNameError('Vui lòng nhập tên nhà cung cấp.')
      valid = false
    } else {
      setNameError('')
    }

    if (!imel) {
      setimelError('Vui lòng nhập imel.')
      valid = false
    } else {
      setimelError('')
    }

    if (!dungluong) {
      setdungluongError('Vui lòng nhập số dung lượng máy.')
      valid = false
    } else {
      setdungluongError('')
    }

    if (!color) {
      setcolorError('Vui lòng nhập màu sắc.')
      valid = false
    } else {
      setcolorError('')
    }

    return valid
  }

  const handleAddSanPham = async () => {
    if (valicolorInputs()) {
      try {
        const response = await fetch(
          `http://localhost:8080/postsp/${loaispid}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: name,
              capacity: dungluong,
              imel: imel,
              color: color
            })
          }
        )
        const data = await response.json()

        if (data.message) {
          showToast(`${data.message}`, 'error')
          fetchlohang()
          onClose()
        } else {
          fetchData()
          handleClose()
          showToast('Thêm sản phẩm thành công')
        }
      } catch (error) {
        console.error('Lỗi khi gửi yêu cầu thêm sản phẩm:', error)
        showToast('Thêm lô hàng thất bại', 'error')
        handleClose()
      }
    }
  }

  const resetForm = useCallback(() => {
    setName('')
    setimel('')
    setdungluong('')
    setcolor('')
    setNameError('')
    setimelError('')
    setdungluongError('')
    setcolorError('')
  }, [])

  const handleClose = () => {
    resetForm()
    onClose()
  }
  
  useEffect(() => {
  const eventSource = new EventSource('http://localhost:8080/events')

  eventSource.onmessage = event => {
    const newMessage = JSON.parse(event.data)
    showToast(newMessage.message)
    fetchData()
  }

  return () => {
    eventSource.close()
  }
}, [])


  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className='divAddSanPham'>
        <h2>Thêm sản phẩm</h2>
        <div className='divtenkho'>
          <input
            type='text'
            className={`tenkho ${nameError ? 'input-error' : ''}`}
            placeholder=''
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <label htmlFor='' className='label'>
            Nhập tên sản phẩm
          </label>
        </div>
        {nameError && <div className='error'>{nameError}</div>}

        <div className='divdiachikho'>
          <input
            type='text'
            className={`diachi ${imelError ? 'input-error' : ''}`}
            placeholder=''
            value={imel}
            onChange={e => setimel(e.target.value)}
          />
          <label htmlFor='' className='label'>
            Nhập imel
          </label>
        </div>
        {imelError && <div className='error'>{imelError}</div>}

        <div className='divdiachikho'>
          <input
            type='text'
            className={`diachi ${dungluongError ? 'input-error' : ''}`}
            placeholder=''
            value={dungluong}
            onChange={e => setdungluong(e.target.value)}
          />
          <label htmlFor='' className='label'>
            Nhập dung lượng máy
          </label>
        </div>
        {dungluongError && <div className='error'>{dungluongError}</div>}

        <div className='divdiachikho'>
          <input
            type='text'
            className={`diachi ${colorError ? 'input-error' : ''}`}
            placeholder=''
            value={color}
            onChange={e => setcolor(e.target.value)}
          />
          <label htmlFor='' className='label'>
            Nhập màu sắc
          </label>
        </div>
        {colorError && <div className='error'>{colorError}</div>}

        <button onClick={handleAddSanPham} className='btnAddLoHang'>
          Thêm sản phẩm
        </button>
        <button onClick={handleClose} className='btnhuyAddLoHang'>
          Hủy
        </button>
      </div>
    </Modal>
  )
}

export default FormAddTay
