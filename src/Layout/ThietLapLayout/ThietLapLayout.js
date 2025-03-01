import React, { useState, useEffect } from 'react'

import './ThietLapLayout.scss'
import { useNavigate } from 'react-router-dom'

function ThietLapLayout () {
  const [symbolPosition, setSymbolPosition] = useState(5000)
  const [currency, setCurrency] = useState('VND')
  const navigate = useNavigate()

  useEffect(() => {
    const token =
      sessionStorage.getItem('token') || localStorage.getItem('token')
    if (!token) {
      navigate('/')
    }
  }, [navigate])

  return (
    <div className='thiet-lap-container'>
      <h2 className='thiet-lap-title'>Thông tin chung</h2>

      <div className='thiet-lap-section'>
        <h3 className='thiet-lap-section-title'>Tiền tệ</h3>
        <div className='thiet-lap-field'>
          <label>Loại tiền</label>
          <input
            type='text'
            value={currency}
            onChange={e => setCurrency(e.target.value)}
          />
        </div>
        <div className='thiet-lap-field'>
          <label>Ký hiệu</label>
          <input type='text' />
        </div>
        <div className='thiet-lap-field'>
          <label>Vị trí ký hiệu</label>
          <input
            type='number'
            value={symbolPosition}
            onChange={e => setSymbolPosition(e.target.value)}
          />
        </div>
        <div className='thiet-lap-field'>
          <label>Mệnh giá tiền</label>
          <div className='thiet-lap-money-values'>
            {[100000, 50000, 20000, 10000, 5000, 2000, 1000].map(
              (value, index) => (
                <button key={index} className='thiet-lap-button'>
                  {value}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      <div className='thiet-lap-section'>
        <h3 className='thiet-lap-section-title'>Hàng hóa</h3>
        <div className='thiet-lap-checkbox-group'>
          <label>
            <input type='checkbox' />
            Quản lý theo nhiều đơn vị tính
          </label>
          <label>
            <input type='checkbox' />
            Quản lý theo Lô/Hạn sử dụng
          </label>
          <label>
            <input type='checkbox' defaultChecked />
            Quản lý theo Serial/IMEI
          </label>
        </div>
      </div>

      <div className='thiet-lap-section'>
        <h3 className='thiet-lap-section-title'>Thông tin chữ ký</h3>
        <div className='thiet-lap-checkbox-group'>
          <label>
            <input type='checkbox' defaultChecked />
            In tên người ký lên chứng từ, báo cáo
          </label>
        </div>
      </div>

      <div className='thiet-lap-section'>
        <h3 className='thiet-lap-section-title'>Định dạng số</h3>
        <div className='thiet-lap-field-group'>
          <div className='thiet-lap-field'>
            <label>Dấu ngăn cách hàng nghìn</label>
            <input type='text' />
          </div>
          <div className='thiet-lap-field'>
            <label>Dấu phân cách hàng thập phân</label>
            <input type='text' />
          </div>
          <div className='thiet-lap-field'>
            <label>Số lượng</label>
            <input type='number' />
          </div>
          <div className='thiet-lap-field'>
            <label>Đơn giá</label>
            <input type='number' />
          </div>
          <div className='thiet-lap-field'>
            <label>Thành tiền</label>
            <input type='number' />
          </div>
          <div className='thiet-lap-field'>
            <label>Hệ số, tỷ lệ</label>
            <input type='number' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThietLapLayout
