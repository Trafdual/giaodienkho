/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react'
import './HoaDonLayout.scss'

import { AddHoaDon } from './AddHoaDon'
import { PaginationComponent } from '~/components/NextPage'
import Invoice from './Invoice'
import { useNavigate } from 'react-router-dom'

function HoaDonLayout () {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [hoadon, setHoaDon] = useState([])

  const [khoID, setKhoID] = useState(localStorage.getItem('khoID') || '')
  const componentRef = useRef()
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(9)

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newKhoID = localStorage.getItem('khoID') || ''
      if (newKhoID !== khoID) {
        console.log('Interval detected change, updating khoID:', newKhoID)
        setKhoID(newKhoID)
      }
    }, 1000)

    return () => clearInterval(intervalId)
  }, [khoID])

  const fetchHoaDon = async () => {
    try {
      const response = await fetch(`https://ansuataohanoi.com/hoadon/${khoID}`)
      const data = await response.json()
      setHoaDon(data)
    } catch (error) {
      console.error('Error fetching hóa đơn:', error)
    }
  }

  useEffect(() => {
    fetchHoaDon()
  }, [khoID])

  useEffect(() => {
    const token =
      sessionStorage.getItem('token') || localStorage.getItem('token')
    if (!token) {
      navigate('/')
    }
  }, [navigate])

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = hoadon.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(hoadon.length / itemsPerPage)
  const totalResults = hoadon.length

  // Chuyển trang
  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber)
  }

  const handlePrint = hd => {
    const printContent = `
    <style>
      body {
        font-family: Arial, sans-serif;
        padding: 20px;
      }
      h2 {
        text-align: center;
      }
      .invoice-header, .invoice-footer {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
      }
      .invoice-footer {
        margin-top: 30px;
        border-top: 1px solid #000;
        padding-top: 10px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      table, th, td {
        border: 1px solid black;
      }
      th, td {
        padding: 8px;
        text-align: left;
      }
      .text-right {
        text-align: right;
      }
              .text-center {
        text-align: center;
      }
    </style>

    <div>
      <h2>HÓA ĐƠN BÁN HÀNG</h2>
      <div class="invoice-header">
        <div>
          <p><strong>Cửa hàng ABC</strong></p>
          <p>Địa chỉ: 123 Đường XYZ, Hà Nội</p>
          <p>SĐT: 0123456789</p>
        </div>
        <div>
          <p><strong>Mã hóa đơn:</strong> ${hd.mahd}</p>
          <p><strong>Ngày xuất:</strong> ${hd.date}</p>
          <p><strong>Mã khách hàng:</strong> ${hd.makh}</p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th class='text-center'>Mã sản phẩm</th>
            <th class='text-center'>Sản phẩm</th>
            <th class='text-center'>Dung lượng</th>
            <th class='text-center'>Màu sắc</th>
            <th class='text-center'>Đơn giá</th>
            <th class='text-center'>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          ${hd.sanpham
            .map(
              sp => `
            <tr>
              <td class='text-center'>${sp.masp}</td>
              <td class='text-center'>${sp.tenmay}</td>
              <td class='text-center'>${sp.dungluong}</td>
              <td class='text-center'>${sp.mausac}</td>
              <td class="text-center">${sp.price.toLocaleString()} VND</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>

      <div class="invoice-footer">
        <div>
          <p><strong>Cảm ơn quý khách đã mua hàng!</strong></p>
        </div>
        <div>
          <p><strong>Tổng tiền:</strong> ${hd.tongtien.toLocaleString()} VND</p>
        </div>
      </div>
    </div>
  `

    const newWindow = window.open('', '', 'width=800,height=600')
    newWindow.document.write(printContent)
    newWindow.document.close()
    newWindow.focus()
    setTimeout(() => {
      newWindow.print()
      newWindow.close()
    }, 10000) // Độ trễ 500ms
  }

  return (
    <div className='hoa-don-layout' ref={componentRef}>
      <div className='headernhap'>
        <h2 className='divncc'>Hóa đơn</h2>
      </div>

      <div ref={componentRef}>
        {selectedInvoice && <Invoice hd={selectedInvoice} />}
      </div>
      <div className='divtablehoadon'>
        <table className='tablenhap'>
          <thead className='theadnhap'>
            <tr>
              <td className='tdnhap'>Mã hóa đơn</td>
              <td className='tdnhap'>Mã khách hàng</td>
              <td className='tdnhap'>Ngày xuất</td>
              <td className='tdnhap'>Tổng tiền</td>
              <td className='tdnhap'>Chức năng</td>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map(hd => (
                <tr key={hd._id}>
                  <td>{hd.mahd}</td>
                  <td>{hd.makh}</td>
                  <td>{hd.date}</td>
                  <td>{hd.tongtien ? hd.tongtien.toLocaleString() : 0} VNĐ</td>
                  <td>
                    <button
                      className='btn-print'
                      onClick={() => {
                        // setSelectedInvoice(hd) // Đặt hóa đơn được chọn
                        handlePrint(hd) // Gọi hàm in
                      }}
                    >
                      In hóa đơn
                    </button>
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
      </div>

      <AddHoaDon
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        khoID={khoID}
        fetchData={fetchHoaDon}
      />
      <div className='pagination1'>
        <PaginationComponent
          totalPages={totalPages}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          totalResults={totalResults}
          fetchData={fetchHoaDon}
        />
      </div>
    </div>
  )
}

export default HoaDonLayout
