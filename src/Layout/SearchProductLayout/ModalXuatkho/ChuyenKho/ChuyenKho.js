/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { useToast } from '../../../../components/GlobalStyles/ToastContext'
import { Modal } from '../../../../components/Modal'
import { getFromLocalStorage } from '~/components/MaHoaLocalStorage/MaHoaLocalStorage'
function ChuyenKho ({ isOpen, onClose, fetchData, idsanpham }) {
  const { showToast } = useToast()
  const [datakho, setdatakho] = useState([])
  const [tenkho, setTenkho] = useState('')
  const [userID, setuserID] = useState(getFromLocalStorage('userId'))
  const [loadingSuppliers, setLoadingSuppliers] = useState(true) // Trạng thái tải dữ liệu

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newuserID = getFromLocalStorage('userId') || ''
      if (newuserID !== userID) {
        console.log('Interval detected change, updating khoID:', newuserID)
        setuserID(newuserID)
      }
    }, 1000) // Kiểm tra mỗi giây

    return () => clearInterval(intervalId)
  }, [getFromLocalStorage('userId')])

  const handleGetKho = async () => {
    try {
      const response = await fetch(`http://localhost:3015/getdepot/${userID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setdatakho(data)
      } else {
        console.error('Failed to fetch data')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoadingSuppliers(false)
    }
  }

  useEffect(() => {
    handleGetKho()
  }, [userID])

  const postchuyenkho = async () => {
    try {
      const response = await fetch(
        `http://localhost:3015/chuyenkho/${idsanpham}`,
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
        fetchData()
        onClose()
      } else {
        console.error('Failed to fetch data')
        showToast('Xuất kho thất bại', 'error')
        onClose()
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className='divtenkho'>
        {loadingSuppliers ? (
          <p>Đang tải danh sách kho chứa...</p>
        ) : (
          <select
            className={`tenkho`}
            value={tenkho}
            onChange={e => setTenkho(e.target.value)}
          >
            <option value='' disabled>
              Chọn kho chứa
            </option>
            {datakho.map(supplier => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        )}
        <label htmlFor='' className='label'>
          Kho chứa
        </label>
        <button onClick={postchuyenkho} className='btnhuyAddNhaCungCap'>
          Chuyển kho
        </button>
        <button onClick={onClose} className='btnhuyAddNhaCungCap'>
          Hủy
        </button>
      </div>
    </Modal>
  )
}

export default ChuyenKho
