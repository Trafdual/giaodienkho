/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import './ThuNoLayout.scss'
import { PaginationComponent } from '~/components/NextPage'
import { getFromLocalStorage } from '~/components/MaHoaLocalStorage/MaHoaLocalStorage'
import { ModalThuNo } from './ModalThuNo'
import { useNavigate } from 'react-router-dom'

function ThuNoLayout () {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Thu nợ KH')
  const [data, setdata] = useState([])
  const userId = getFromLocalStorage('userId') || ''
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [currentPage, setCurrentPage] = useState(1)
  const [khoID, setKhoID] = useState(localStorage.getItem('khoID') || '')
  const [hoadons, sethoadons] = useState([])
  const [isOpenThuNo, setIsOpenThuNo] = useState(false)
  const [khachhangid, setkhachhangid] = useState('')

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

  useEffect(() => {
    const token =
      sessionStorage.getItem('token') || localStorage.getItem('token')
    if (!token) {
      navigate('/')
    }
  }, [navigate])

  const totalPages = Math.ceil(data.length / itemsPerPage)
  const totalResults = data.length
  const handlePageChange = page => {
    setCurrentPage(page)
  }

  const fetchhoadon = async () => {
    try {
      const response = await fetch(
        `https://ansuataohanoi.com/gettrano/${khoID}`
      )
      if (response.ok) {
        const data = await response.json()
        setdata(data)
      }
    } catch (error) {
      console.error('Error fetching:', error)
    }
  }

  useEffect(() => {
    if (khoID) {
      fetchhoadon()
    }
  }, [khoID])

  const renderTabContent = () => {
    if (activeTab === 'Thu nợ KH') {
      return (
        <div className='divtablethuno'>
          <table className='thu-no-table'>
            <thead>
              <tr className='trthuno'>
                <th className='text-left'>Tên Khách Hàng</th>
                <th>Địa Chỉ</th>
                <th>Số Điện Thoại</th>
                <th className='text-right'>Tổng Dư Nợ</th>
                <th className='text-right'>
                  <i className='isetting'></i>
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td className='text-left'>{item.namekhachhang}</td>
                  <td>{item.address}</td>
                  <td>{item.phone}</td>
                  <td className='text-right'>
                    {item.tongtien.toLocaleString()}
                  </td>
                  <td>
                    <button
                      className='thu-no-button'
                      onClick={() => {
                        sethoadons(item.ids)
                        setIsOpenThuNo(true) //
                        setkhachhangid(item.khachhangid)
                      }}
                    >
                      Thu nợ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <ModalThuNo
            isOpen={isOpenThuNo}
            onClose={() => setIsOpenThuNo(false)}
            userId={userId}
            hoadons={hoadons}
            khoID={khoID}
            fetchhoadon={fetchhoadon}
            khachhangid={khachhangid}
          />
        </div>
      )
    }
    if (activeTab === 'Phiếu thu') {
      return <div className='tab-content'>Nội dung Phiếu thu</div>
    }
    if (activeTab === 'Phiếu chi') {
      return <div className='tab-content'>Nội dung Phiếu chi</div>
    }
  }

  return (
    <div className='thu-no-container'>
      <div className='header1'>
        <div className='tabs'>
          {['Thu nợ KH', 'Phiếu thu', 'Phiếu chi'].map(tab => (
            <span
              key={tab}
              className={activeTab === tab ? 'active-tab' : ''}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </span>
          ))}
        </div>
      </div>

      <div className='tab-content-container'>{renderTabContent()}</div>
      <div className='pagination1'>
        <PaginationComponent
          totalPages={totalPages}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          totalResults={totalResults}
          fetchData={fetchhoadon}
        />
      </div>
    </div>
  )
}

export default ThuNoLayout
