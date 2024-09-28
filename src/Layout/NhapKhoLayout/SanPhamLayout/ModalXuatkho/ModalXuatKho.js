/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'

import { Modal } from '../../../../../components/Modal'
import { useToast } from '../../../../../components/GlobalStyles/ToastContext'

function ModalXuatKho ({ isOpen, onClose, idloaisp }) {
  const { showToast } = useToast()
  const [datakho, setdatakho] = useState([])
  const [userID, setuserID] = useState(
    localStorage.getItem('userId') || sessionStorage.getItem('userId') || ''
  )
  const [tenkho, setTenkho] = useState('')

  const [khoID, setKhoID] = useState(localStorage.getItem('khoID') || sessionStorage.getItem('khoID') || '')

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newKhoID = localStorage.getItem('khoID') || ''
      if (newKhoID !== khoID) {
        console.log('Interval detected change, updating khoID:', newKhoID)
        setKhoID(newKhoID)
      }
    }, 1000) // Kiểm tra mỗi giây

    return () => clearInterval(intervalId)
  }, [khoID])

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newuserID = localStorage.getItem('userId') || ''
      if (newuserID !== userID) {
        console.log('Interval detected change, updating khoID:', newuserID)
        setuserID(newuserID)
      }
    }, 1000) // Kiểm tra mỗi giây

    return () => clearInterval(intervalId)
  }, [localStorage.getItem('userId')])

  const handleGetKho = async () => {
    try {
      const response = await fetch(
        `https://www.ansuataohanoi.com/getdepot/${userID}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        setdatakho(data)
      } else {
        console.error('Failed to fetch data')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    handleGetKho()
  }, [userID])

  const handlexuatkho = async (idsp) => {
    
      try {
        const response = await fetch(
          `https://www.ansuataohanoi.com/xuatkho/${idsp}/${idloaisp}/${khoID}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              tenkho: tenkho
            })
          }
        )
        if (response.ok) {
          showToast('xuất kho thành công')
        } else {
          showToast('xuất kho thất bại', 'error')
          onClose()
        }
      } catch (error) {
        console.error('Lỗi khi gửi yêu cầu xuất kho:', error)
        showToast('xuất kho thất bại', 'error')
      }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className='divAddSanPham'>
        <h2>Chọn kho chứa</h2>
        <div className='divtenkho'>
          {datakho ? (
            <p>Đang tải danh sách kho chứa...</p>
          ) : (
            <select
              className='tenkho'
              value={tenkho}
              onChange={e => setTenkho(e.target.value)}
            >
              <option value='' disabled>
                Chọn kho chứa
              </option>
              {datakho.map(datakho => (
                <option key={datakho.id} value={datakho.id}>
                  {datakho.name}
                </option>
              ))}
            </select>
          )}
          <label htmlFor='' className='label'>
            Tên kho chứa
          </label>
        </div>
         <button onClick={handlexuatkho} className='btnAddLoHang'>
          Thêm lô hàng
        </button>
      </div>
    </Modal>
  )
}

export default ModalXuatKho
