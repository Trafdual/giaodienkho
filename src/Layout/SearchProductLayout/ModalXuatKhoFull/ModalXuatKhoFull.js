/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { useToast } from '../../../components/GlobalStyles/ToastContext'
import { Modal } from '../../../components/Modal'
function ModalXuatKhoFull ({
  isOpen,
  onClose,
  fetchData,
  selectedItems,
  setSelectedItems,
  setSelectAll
}) {
  const { showToast } = useToast()
  const [datakho, setdatakho] = useState([])
  const [tenkho, setTenkho] = useState('')
  const [userID, setuserID] = useState(
    localStorage.getItem('userId') || sessionStorage.getItem('userId') || ''
  )
  const [loadingSuppliers, setLoadingSuppliers] = useState(true) // Trạng thái tải dữ liệu

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
    } finally {
      setLoadingSuppliers(false)
    }
  }

  useEffect(() => {
    handleGetKho()
  }, [userID])

  const postchuyenkho = async () => {
    const idsanpham1 = selectedItems.map(item => item._id)
    try {
      const response = await fetch(`https://www.ansuataohanoi.com/chuyenkho2`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tenkho: tenkho,
          idsanpham1: idsanpham1
        })
      })
      const data = await response.json()

      if (data.message) {
        showToast(`${data.message}`)
        fetchData()
        onClose()
        setSelectedItems([])
        setSelectAll(false)
      } else {
        console.error('Failed to fetch data')
        showToast('chuyển kho thất bại', 'error')
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
        <button onClick={postchuyenkho} className='btnAddLoHang'>
        Chuyển kho
      </button>
      <button onClick={onClose} className='btnhuyAddLoHang'>
        Hủy
      </button>
      </div>
    
    </Modal>
  )
}

export default ModalXuatKhoFull
