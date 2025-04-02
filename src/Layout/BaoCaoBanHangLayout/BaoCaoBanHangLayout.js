import './BaoCaoBanHangLayout.scss'
import { useState, useEffect } from 'react'
import { Loading } from '~/components/Loading'
import { useNavigate } from 'react-router-dom'
function BaoCaoBanHangLayout () {
  const formatDate = date => {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  const navigate = useNavigate()

  useEffect(() => {
    const token =
      sessionStorage.getItem('token') || localStorage.getItem('token')
    if (!token) {
      navigate('/')
    }
  }, [navigate])

  const [data, setdata] = useState([])
  const [fromdate, setfromdate] = useState(formatDate(new Date()))
  const [enddate, setenddate] = useState(formatDate(new Date()))
  const [khoID, setKhoID] = useState(localStorage.getItem('khoID') || '')
  const [loading, setLoading] = useState(false)

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

  const fetchdata = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `http://localhost:3015/baocaobanhang/${khoID}?fromdate=${fromdate}&enddate=${enddate}`
      )
      if (response.ok) {
        const data = await response.json()
        setdata(data)
      }
    } catch (error) {
      console.error('Error fetching:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='bao-cao-ban-hang-layout'>
      {loading && <Loading />}
      <div className='header'>
        <button className='btn'>Chọn báo cáo</button>
        <div className='filters'>
          <select>
            <option>Tháng này</option>
          </select>
          <div className='divdatetong'>
            <div className='divtungay'>
              <label htmlFor=''>Từ ngày:</label>
              <input
                type='date'
                value={fromdate}
                onChange={e => setfromdate(e.target.value)}
              />
            </div>
            <div className='divdenngay'>
              <label htmlFor=''>Đến ngày:</label>
              <input
                type='date'
                value={enddate}
                onChange={e => setenddate(e.target.value)}
              />
            </div>
          </div>

          <button className='btn' onClick={fetchdata}>
            Lấy dữ liệu
          </button>
        </div>
        <div className='actions'>
          <button className='btn'>In</button>
          <button className='btn'>Xuất khẩu</button>
          <button className='btn'>⚙️</button>
        </div>
      </div>

      <div className='table-container'>
        <table>
          <thead>
            <tr>
              <th>Ngày</th>
              <th>Tổng</th>
              <th>Tiền hàng</th>
              <th>Tiền phí</th>
              <th>Khuyến mại</th>
              <th>Tỷ lệ KM (%)</th>
              <th>Tiền mặt</th>
              <th>Chuyển khoản</th>
              <th>Công nợ</th>
              <th>Thu hộ</th>
              <th>Thực thu</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index}>
                  <td>{item.date}</td>
                  <td>{(item.tienmat + item.chuyenkhoan).toLocaleString()}</td>
                  <td>{(item.tienmat + item.chuyenkhoan).toLocaleString()}</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                  <td>{item.tienmat.toLocaleString()}</td>
                  <td>{item.chuyenkhoan.toLocaleString()}</td>
                  <td>{item.congNo.toLocaleString()}</td>
                  <td>0</td>
                  <td>
                    {(
                      item.tienmat +
                      item.chuyenkhoan -
                      item.congNo
                    ).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='11'>Không có dữ liệu</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default BaoCaoBanHangLayout
