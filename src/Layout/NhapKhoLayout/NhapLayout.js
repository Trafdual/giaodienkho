/* eslint-disable react-hooks/exhaustive-deps */
import './NhapKhoLayout.scss'
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { AddLoHang } from './AddLoHang'
function NhapKhoLayout () {
  const [lohang, setlohang] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [opendetail, setopendetail] = useState(true)

  const [khoID, setKhoID] = useState(localStorage.getItem('khoID') || '')
  const handleCloseModal = () => {
    setIsOpen(false)
  }
  const handleLohang = id => {
    setopendetail(false)
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newKhoID = localStorage.getItem('khoID') || ''
      if (newKhoID !== khoID) {
        console.log('Interval detected change, updating khoID:', newKhoID)
        setKhoID(newKhoID)
      }
    }, 1000) // Kiểm tra mỗi giây

    return () => clearInterval(intervalId)
  }, [localStorage.getItem('khoID')])

  useEffect(() => {
    console.log(localStorage.getItem('khoID'))
    let isMounted = true

    const fetchData = async () => {
      if (!khoID) return

      try {
        const response = await fetch(
          `http://localhost:8080/getloaisanpham2/${khoID}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )

        if (response.ok && isMounted) {
          const data = await response.json()
          setlohang(data)
        } else {
          console.error('Failed to fetch data')
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching data:', error)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [khoID])

  return (
    <>
      {opendetail && (
        <div className='detailsnhap'>
          <div className='recentOrdersnhap'>
            <div className='headernhap'>
              <h2 className='divncc'>Lô hàng</h2>
              <button className='btnthemlo' onClick={() => setIsOpen(true)}>
                <FontAwesomeIcon className='iconncc' icon={faPlus} />
                <h3>Thêm lô hàng</h3>
              </button>
            </div>
            <table className='tablenhap'>
              <thead className='theadnhap'>
                <tr>
                 <td className='tdnhap'>Mã lô hàng</td>
                  <td className='tdnhap'>Tên lô hàng</td>
                  <td className='tdnhap'>Số lượng máy</td>
                  <td className='tdnhap'>Ngày nhập</td>
                  <td className='tdnhap'>Tổng tiền</td>
                  <td className='tdnhap'>Trung bình máy</td>
                  <td className='tdnhap'>Chức năng</td>
                </tr>
              </thead>
              <tbody className='tbodynhap'>
                {lohang.length > 0 ? (
                  lohang.map(ncc => (
                    <tr key={ncc._id}>
                      <td>{ncc.malsp}</td>
                      <td>{ncc.name}</td>
                      <td>{ncc.soluong}</td>
                      <td>{ncc.date}</td>
                      <td>{ncc.tongtien}</td>
                      <td>{ncc.average}</td>
                      <td className='tdchucnang'>
                        <button
                          className='btnchitietncc'
                          onClick={() => handleLohang(ncc._id)}
                        >
                          <h3>Chi tiết</h3>
                        </button>
                        <button
                          className='btncnncc'
                          onClick={() => setIsOpen(true)}
                        >
                          <h3>Cập nhật thông tin</h3>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan='7'>Không có lô hàng nào</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        <AddLoHang isOpen={isOpen} onClose={handleCloseModal} setlohang={setlohang}/>
        </div>
      )}

    </>
  )
}

export default NhapKhoLayout
