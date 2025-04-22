/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'

import { Modal } from '~/components/Modal'
import { useToast } from '~/components/GlobalStyles/ToastContext'
import { getApiUrl } from '~/api/api'

function EditNganHang ({ isOpen, onClose, idnganhang, fetchdata }) {
  const [name, setName] = useState('')
  const [sotaikhoan, setSoTaiKhoan] = useState('')

  const [chusohuu, setChuSoHuu] = useState('')

  const { showToast } = useToast()
  const [nameError, setnameError] = useState('')
  const [sotaikhoanError, setsotaikhoanError] = useState('')

  const [chusohuuError, setchusohuuError] = useState('')

  const fetchchitiet = async () => {
    try {
      const response = await fetch(
        `${getApiUrl('domain')}/getchitietnganhang/${idnganhang}`
      )
      const data = await response.json()
      if (response.ok) {
        setName(data.name)
        setSoTaiKhoan(data.sotaikhoan)
        setChuSoHuu(data.chusohuu)
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu lấy chi tiết ngân hàng:', error)
      showToast('lấy chi tiết ngân hàng thất bại', 'error')
    }
  }

  useEffect(() => {
    if (isOpen && idnganhang) {
      fetchchitiet()
    }
  }, [isOpen, idnganhang])

  const validateInputs = () => {
    let valid = true

    if (!name) {
      setnameError('Vui lòng nhập tên ngân hàng.')
      valid = false
    } else {
      setnameError('')
    }
    if (!sotaikhoan) {
      setsotaikhoanError('Vui lòng nhập số tài khoản.')
      valid = false
    } else {
      setsotaikhoanError('')
    }

    if (!chusohuu) {
      setchusohuuError('Vui lòng nhập chủ sở hữu.')
      valid = false
    } else {
      setchusohuuError('')
    }

    return valid
  }

  const handleAddKho = async () => {
    if (validateInputs()) {
      try {
        const response = await fetch(
          `${getApiUrl('domain')}/updatenganhang/${idnganhang}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: name,
              sotaikhoan: sotaikhoan,
              chusohuu: chusohuu
            })
          }
        )
        if (response.ok) {
          fetchdata()
          onClose()
          showToast('Cập nhật ngân hàng thành công')
        } else {
          showToast('Cập nhật ngân hàng thất bại', 'error')
          onClose()
        }
      } catch (error) {
        console.error('Lỗi khi gửi yêu cầu Cập nhật ngân hàng:', error)
        showToast('Cập nhật ngân hàng thất bại', 'error')
        onClose()
      }
    }
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className='divaddkho'>
        <h2>Cập nhật ngân hàng</h2>
        <div className='divtenkho'>
          <input
            type='text'
            className={`tenkho ${nameError ? 'input-error' : ''}`}
            placeholder=''
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <label htmlFor='' className='label'>
            Nhập tên ngân hàng
          </label>
        </div>
        {nameError && <div className='error'>{nameError}</div>}

        <div className='divtenkho'>
          <input
            type='text'
            className={`tenkho ${sotaikhoanError ? 'input-error' : ''}`}
            placeholder=''
            value={sotaikhoan}
            onChange={e => setSoTaiKhoan(e.target.value)}
          />
          <label htmlFor='' className='label'>
            Nhập số tài khoản
          </label>
        </div>
        {sotaikhoanError && <div className='error'>{sotaikhoanError}</div>}

        <div className='divtenkho'>
          <input
            type='text'
            className={`tenkho ${chusohuuError ? 'input-error' : ''}`}
            placeholder=''
            value={chusohuu}
            onChange={e => setChuSoHuu(e.target.value)}
          />
          <label htmlFor='' className='label'>
            Nhập tên chủ sở hữu
          </label>
        </div>
        {chusohuuError && <div className='error'>{chusohuuError}</div>}

        <hr />
        <button onClick={handleAddKho} className='btnaddkho'>
          Cập nhật ngân hàng
        </button>
        <button
          onClick={() => alert('Hủy Cập nhật ngân hàng')}
          className='btnhuyaddkho'
        >
          Hủy
        </button>
      </div>
    </Modal>
  )
}

export default EditNganHang
