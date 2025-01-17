/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import './ThuNoLayout.scss'
import { PaginationComponent } from '~/components/NextPage'
import { useToast } from '~/components/GlobalStyles/ToastContext'

function ThuNoLayout () {
  const [activeTab, setActiveTab] = useState('Thu nợ KH')
  const { showToast } = useToast()

  const [data, setdata] = useState([])

  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [currentPage, setCurrentPage] = useState(1)
  const [khoID, setKhoID] = useState(localStorage.getItem('khoID') || '')
  const [ids, setids] = useState([])

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

  const totalPages = Math.ceil(data.length / itemsPerPage)
  const totalResults = data.length
  const handlePageChange = page => {
    setCurrentPage(page)
  }
  console.log(ids)

  const fetchhoadon = async () => {
    try {
      const response = await fetch(`http://localhost:8080/gettrano/${khoID}`)
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

  const handleThuNo = async () => {
    try {
      const response = await fetch('http://localhost:8080/thuno', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          body: JSON.stringify({ ids })
        }
      })

      if (response.ok) {
        showToast('Thu nợ thành công')
        fetchhoadon()
      }
    } catch (error) {
      console.error('Error fetching:', error)
    }
  }

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
                      onClick={() => setids(item.ids)}
                    >
                      Thu nợ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
