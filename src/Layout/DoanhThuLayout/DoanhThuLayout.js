import React, { useState } from 'react'
import './DoanhThuLayout.scss' // Import file CSS để style trang
import { Loading } from '~/components/Loading'

function DoanhThuLayout () {
  const formatDate = date => {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  const [currentPeriod, setCurrentPeriod] = useState('Kỳ hiện tại')
  const [data, setdata] = useState({})
  const [startDate, setStartDate] = useState(formatDate(new Date()))
  const [endDate, setEndDate] = useState(formatDate(new Date()))
  const [startDatetruoc, setStartDatetruoc] = useState(formatDate(new Date()))
  const [endDatetruoc, setendDatetruoc] = useState(formatDate(new Date()))
  const [loading, setLoading] = useState(false)

  const khoID = localStorage.getItem('khoID')

  const handleDoanhThu = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `https://ansuataohanoi.com/getdoanhthu/${khoID}?fromDate=${startDate}&endDate=${endDate}&fromDatetruoc=${startDatetruoc}&endDatetruoc=${endDatetruoc}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      const data = await response.json()
      if (response.ok) {
        setdata(data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }
  const handelphantram = (a, b) => {
    const phantram = (a / b) * 100 - 100
    return phantram.toFixed(1)
  }

  return (
    <div className='doanh-thu-layout'>
      {loading && <Loading />}
      <div className='filter-section'>
        <div className='filter-group'>
          <label>Kỳ:</label>
          <select
            value={currentPeriod}
            onChange={e => setCurrentPeriod(e.target.value)}
          >
            <option value='Kỳ trước'>Kỳ trước</option>
          </select>
        </div>
        <div className='date-filter'>
          <div className='divtungay'>
            <label>Từ ngày:</label>
            <input
              type='date'
              value={startDatetruoc}
              onChange={e => setStartDatetruoc(e.target.value)}
            />
          </div>
          <div className='divdenngay'>
            <label>Đến ngày:</label>
            <input
              type='date'
              value={endDatetruoc}
              onChange={e => setendDatetruoc(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className='filter-section'>
        <div className='filter-group'>
          <label>Kỳ:</label>
          <select
            value={currentPeriod}
            onChange={e => setCurrentPeriod(e.target.value)}
          >
            <option value='Kỳ hiện tại'>Kỳ hiện tại</option>
          </select>
        </div>
        <div className='date-filter'>
          <div className='divtungay'>
            <label>Từ ngày:</label>
            <input
              type='date'
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
          </div>
          <div className='divdenngay'>
            <label>Đến ngày:</label>
            <input
              type='date'
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <button className='btn-get-data' onClick={handleDoanhThu}>
          Lấy dữ liệu
        </button>
      </div>
      <div className='table-section'>
        <table>
          <thead>
            <tr>
              <th>Khoản mục</th>
              <th>
                Kỳ trước
                <br />
                (8)
              </th>
              <th>
                Kỳ hiện tại
                <br />
                (9)
              </th>
              <th>
                Thay đổi (%)
                <br />
                (10)=[(9)/(8)*100]-100
              </th>

              <th>
                Thay đổi (Số tiền)
                <br />
                (11) = (9) - (8)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan='5'>
                <strong>I. Doanh thu</strong>
              </td>
            </tr>
            <tr>
              <td>1. Doanh thu bán hàng</td>
              <td>
                {data.doanhthutruoc ? data.doanhthutruoc.toLocaleString() : 0}
              </td>
              <td>{data.doanhthu ? data.doanhthu.toLocaleString() : 0}</td>
              <td>
                {isNaN(handelphantram(data.doanhthu, data.doanhthutruoc))
                  ? 0
                  : handelphantram(data.doanhthu, data.doanhthutruoc)}
              </td>
              <td>
                {parseFloat(data.doanhthu - data.doanhthutruoc)
                  ? parseFloat(
                      data.doanhthu - data.doanhthutruoc
                    ).toLocaleString()
                  : 0}
              </td>
            </tr>
            <tr>
              <td>2. Tiền hàng bán ra</td>
              <td>
                {data.doanhthutruoc ? data.doanhthutruoc.toLocaleString() : 0}
              </td>
              <td>{data.doanhthu ? data.doanhthu.toLocaleString() : 0}</td>
              <td>
                {isNaN(handelphantram(data.doanhthu, data.doanhthutruoc))
                  ? 0
                  : handelphantram(data.doanhthu, data.doanhthutruoc)}
              </td>
              <td>
                {parseFloat(data.doanhthu - data.doanhthutruoc)
                  ? parseFloat(
                      data.doanhthu - data.doanhthutruoc
                    ).toLocaleString()
                  : 0}
              </td>
            </tr>
            {/* Phần III. Chi phí */}
            <tr>
              <td colSpan='5'>
                <strong>II. Chi phí</strong>
              </td>
            </tr>
            <tr>
              <td>1. Chi phí giá vốn hàng hóa</td>
              <td>
                {data.loaisanphamdoanhthutruoc
                  ? data.loaisanphamdoanhthutruoc.toLocaleString()
                  : 0}
              </td>
              <td>
                {data.loaisanphamdoanhthu
                  ? data.loaisanphamdoanhthu.toLocaleString()
                  : 0}
              </td>
              <td>
                {isNaN(
                  handelphantram(
                    data.loaisanphamdoanhthu,
                    data.loaisanphamdoanhthutruoc
                  )
                )
                  ? 0
                  : handelphantram(
                      data.loaisanphamdoanhthu,
                      data.loaisanphamdoanhthutruoc
                    )}
              </td>

              <td>
                {parseFloat(
                  data.loaisanphamdoanhthu - data.loaisanphamdoanhthutruoc
                )
                  ? parseFloat(
                      data.loaisanphamdoanhthu - data.loaisanphamdoanhthutruoc
                    ).toLocaleString()
                  : 0}
              </td>
            </tr>
            <tr>
              <td>2. Chi phí khác</td>
              <td>
                {data.thuchidoanhthutruoc
                  ? data.thuchidoanhthutruoc.toLocaleString()
                  : 0}
              </td>
              <td>
                {data.thuchidoanhthu ? data.thuchidoanhthu.toLocaleString() : 0}
              </td>
              <td>
                {isNaN(
                  handelphantram(data.thuchidoanhthu, data.thuchidoanhthutruoc)
                )
                  ? 0
                  : handelphantram(
                      data.thuchidoanhthu,
                      data.thuchidoanhthutruoc
                    )}
              </td>
              <td>
                {parseFloat(data.thuchidoanhthu - data.thuchidoanhthutruoc)
                  ? parseFloat(
                      data.thuchidoanhthu - data.thuchidoanhthutruoc
                    ).toLocaleString()
                  : 0}
              </td>
            </tr>

            {/* Phần IV. Lợi nhuận */}
            <tr>
              <td colSpan='5'>
                <strong>III. Lợi nhuận</strong>
              </td>
            </tr>
            <tr>
              <td>Lợi nhuận</td>
              <td>
                {data.doanhthutongtruoc
                  ? data.doanhthutongtruoc.toLocaleString()
                  : 0}
              </td>
              <td>
                {data.doanhthutong ? data.doanhthutong.toLocaleString() : 0}
              </td>
              <td>
                {isNaN(
                  handelphantram(data.doanhthutong, data.doanhthutongtruoc)
                )
                  ? 0
                  : handelphantram(data.doanhthutong, data.doanhthutongtruoc)}
              </td>

              <td>
                {parseFloat(data.doanhthutong - data.doanhthutongtruoc)
                  ? parseFloat(
                      data.doanhthutong - data.doanhthutongtruoc
                    ).toLocaleString()
                  : 0}
              </td>
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
