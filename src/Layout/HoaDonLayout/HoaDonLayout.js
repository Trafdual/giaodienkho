/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import './HoaDonLayout.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { AddHoaDon } from './AddHoaDon'

function HoaDonLayout () {
  const [isOpen, setIsOpen] = useState(false)
  const [hoadon, setHoaDon] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [khoID, setKhoID] = useState(localStorage.getItem('khoID') || '')

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

  const fetchHoaDon = async () => {
    try {
      const response = await fetch(
        `https://www.ansuataohanoi.com/hoadon/${khoID}`
      )
      const data = await response.json()
      setHoaDon(data)
    } catch (error) {
      console.error('Error fetching hóa đơn:', error)
    }
  }

  useEffect(() => {
    fetchHoaDon()
  }, [khoID])

  // Tính toán dữ liệu cho trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = hoadon.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(hoadon.length / itemsPerPage)

  // Chuyển trang
  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber)
  }

  return (
    <div className='hoa-don-layout'>
      <div className='headernhap'>
        <h2 className='divncc'>Hóa đơn</h2>
        <button className='btnthemlo' onClick={() => setIsOpen(true)}>
          <FontAwesomeIcon className='iconncc' icon={faPlus} />
          <h3>Thêm Hóa Đơn</h3>
        </button>
      </div>

      <table className='table-hoa-don'>
        <thead>
          <tr>
            <th>Mã hóa đơn</th>
            <th>Mã khách hàng</th>
            <th>Ngày xuất</th>
            <th>Tổng tiền</th>
            <th>Chức năng</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map(hd => (
              <tr key={hd._id}>
                <td>{hd.mahd}</td>
                <td>{hd.makh}</td>
                <td>{hd.date}</td>
                <td>{hd.tongtien}</td>
                <td>
                  <button className='btn-view'>chi tiết</button>
                  <button className='btn-print'>In</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='5'>Không có hóa đơn nào</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className='pagination'>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={index + 1 === currentPage ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <AddHoaDon
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        khoID={khoID}
        fetchData={fetchHoaDon}
      />
    </div>
  )
}

export default HoaDonLayout
