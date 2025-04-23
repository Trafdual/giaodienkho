/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import './ThuNoLayout.scss'
import { getFromLocalStorage } from '~/components/MaHoaLocalStorage/MaHoaLocalStorage'
import { useNavigate } from 'react-router-dom'
import { ThuNoKhachHang } from './ThuNoKhachHang'

function ThuNoLayout () {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Thu nợ KH')

  const userId = getFromLocalStorage('userId') || ''
  const [khoID, setKhoID] = useState(localStorage.getItem('khoID') || '')

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
    const token = getFromLocalStorage('token')
    if (!token) {
      navigate('/')
    }
  }, [navigate])

  const renderTabContent = () => {
    if (activeTab === 'Thu nợ KH') {
     return <ThuNoKhachHang khoID={khoID} userId={userId} />
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
    </div>
  )
}

export default ThuNoLayout
