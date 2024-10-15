import React, { useState } from 'react'
import './DoanhThuLayout.scss' // Import file CSS để style trang
import * as XLSX from 'xlsx' // Import thư viện xlsx

function DoanhThuLayout () {
  const [currentPeriod, setCurrentPeriod] = useState('Kỳ hiện tại') // Quản lý kỳ hiện tại
  const [startDate, setStartDate] = useState('2024-07-01') // Quản lý ngày bắt đầu
  const [endDate, setEndDate] = useState('2024-07-31') // Quản lý ngày kết thúc

  // Hàm xuất dữ liệu ra file Excel
  const exportToExcel = () => {
    // Tạo dữ liệu cần xuất
    const data = [
      {
        'Khoản mục': '1. Doanh thu bán hàng',
        'Kỳ hiện tại': 238533826,
        'Kỳ trước': 41055000,
        'Thay đổi (%)': '-83%',
        'Thay đổi (Số tiền)': -197478826
      },
      {
        'Khoản mục': '2. Tiền hàng bán ra',
        'Kỳ hiện tại': 238533826,
        'Kỳ trước': 41055000,
        'Thay đổi (%)': '-83%',
        'Thay đổi (Số tiền)': -197478826
      },
      {
        'Khoản mục': '1. Chi phí giá vốn hàng hóa',
        'Kỳ hiện tại': 214328166,
        'Kỳ trước': 41047425,
        'Thay đổi (%)': '-81%',
        'Thay đổi (Số tiền)': -173280741
      },
      {
        'Khoản mục': 'Lợi nhuận',
        'Kỳ hiện tại': 24205660,
        'Kỳ trước': 41047575,
        'Thay đổi (%)': '-100%',
        'Thay đổi (Số tiền)': -24198085
      }
    ]

    // Tạo workbook và worksheet
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Doanh Thu')

    // Xuất file
    XLSX.writeFile(workbook, `Doanh_Thu_${currentPeriod}.xlsx`)
  }

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
        <button className='btn-export' onClick={exportToExcel}>
          Xuất Excel
        </button>
      </div>
    </div>
  )
}

export default DoanhThuLayout
