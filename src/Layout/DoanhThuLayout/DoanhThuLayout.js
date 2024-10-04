import React, { useState } from 'react'
import './DoanhThuLayout.scss' // Import file CSS để style trang

function DoanhThuLayout () {
  const [currentPeriod, setCurrentPeriod] = useState('Kỳ hiện tại') // Quản lý kỳ hiện tại (có thể thêm tùy chọn để thay đổi)
  const [startDate, setStartDate] = useState('01/07/2024') // Quản lý ngày bắt đầu
  const [endDate, setEndDate] = useState('31/07/2024') // Quản lý ngày kết thúc

  return (
    <div className='doanh-thu-layout'>
      <div className='filter-section'>
        {/* Phần chọn kỳ và ngày */}
        <div className='filter-group'>
          <label>Kỳ:</label>
          <select
            value={currentPeriod}
            onChange={e => setCurrentPeriod(e.target.value)}
          >
            <option value='Kỳ trước'>Kỳ trước</option>
            <option value='Tháng trước'>Tháng trước</option>
            <option value='Kỳ hiện tại'>Kỳ hiện tại</option>
          </select>
        </div>
        <div className='date-filter'>
          <label>Từ ngày:</label>
          <input
            type='date'
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
          <label>Đến ngày:</label>
          <input
            type='date'
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
          <button className='btn-get-data'>Lấy dữ liệu</button>
        </div>
      </div>

      <div className='table-section'>
        <table>
          <thead>
            <tr>
              <th>Khoản mục</th>
              <th>Kỳ hiện tại</th>
              <th>Kỳ trước</th>
              <th>Thay đổi (%)</th>
              <th>Thay đổi (Số tiền)</th>
            </tr>
          </thead>
          <tbody>
            {/* Phần I. Doanh thu */}
            <tr>
              <td colSpan='5'>
                <strong>I. Doanh thu</strong>
              </td>
            </tr>
            <tr>
              <td>1. Doanh thu bán hàng</td>
              <td>238.533.826</td>
              <td>41.055.000</td>
              <td>-83%</td>
              <td>-197.478.826</td>
            </tr>
            <tr>
              <td>2. Tiền hàng bán ra</td>
              <td>238.533.826</td>
              <td>41.055.000</td>
              <td>-83%</td>
              <td>-197.478.826</td>
            </tr>
            {/* Phần III. Chi phí */}
            <tr>
              <td colSpan='5'>
                <strong>III. Chi phí</strong>
              </td>
            </tr>
            <tr>
              <td>1. Chi phí giá vốn hàng hóa</td>
              <td>214.328.166</td>
              <td>41.047.425</td>
              <td>-81%</td>
              <td>-173.280.741</td>
            </tr>
            {/* Phần IV. Lợi nhuận */}
            <tr>
              <td colSpan='5'>
                <strong>IV. Lợi nhuận</strong>
              </td>
            </tr>
            <tr>
              <td>Lợi nhuận</td>
              <td>24.205.660</td>
              <td>41.047.575</td>
              <td>-100%</td>
              <td>-24.198.085</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className='actions'>
        <button className='btn-print'>In</button>
        <button className='btn-export'>Xuất Excel</button>
      </div>
    </div>
  )
}

export default DoanhThuLayout
