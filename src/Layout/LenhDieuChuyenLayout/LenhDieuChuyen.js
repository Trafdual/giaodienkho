import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useToast } from '../../components/GlobalStyles/ToastContext'
import { Loading } from '../../components/Loading' // Import component Loading
import Datepicker from '../../components/Calendar/DatePicker' // Import Datepicker component
import './LenhDieuChuyen.scss'

function LenhDieuChuyen () {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [filterStatus, setFilterStatus] = useState('Chờ xác nhận')
  const [isLoading, setIsLoading] = useState(false) // Trạng thái loading
  const { showToast } = useToast()
  const khoID = localStorage.getItem('khoID')

  const [beginDate, setBeginDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const fetchOrders = async () => {
    setIsLoading(true) // Bắt đầu tải
    try {
      const url =
        beginDate && endDate
          ? `https://www.ansuataohanoi.com/getlenhdctheongay/${khoID}?begintime=${beginDate}&endtime=${endDate}`
          : `https://www.ansuataohanoi.com/getlenhdieuchuyen/${khoID}`

      const response = await axios.get(url)
      setOrders(response.data)
      filterOrders(response.data, filterStatus)
    } catch (error) {
      console.error('Error fetching transfer orders:', error)
      showToast('Không thể tải dữ liệu điều chuyển', 'error')
    } finally {
      setIsLoading(false) // Kết thúc tải
    }
  }

  const filterOrders = (orders, status) => {
    const filtered =
      status === 'Chờ xác nhận'
        ? orders.filter(order => !order.duyet)
        : orders.filter(order => order.duyet)
    setFilteredOrders(filtered)
  }

  useEffect(() => {
    fetchOrders() // Lấy dữ liệu khi component được tải
  }, [showToast])

  const handleFilterChange = status => {
    setFilterStatus(status)
    filterOrders(orders, status)
  }

  const handleSearch = () => {
    if (!beginDate || !endDate) {
      showToast('Vui lòng chọn ngày bắt đầu và ngày kết thúc', 'warning')
      return
    }
    fetchOrders()
  }

  const handleConfirm = async orderId => {
    try {
      const response = await axios.post(
        `https://www.ansuataohanoi.com/duyetdieuchuyen/${orderId}`
      )
      if (response.status === 200) {
        showToast('Duyệt lệnh điều chuyển thành công!', 'success')
        fetchOrders()
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === orderId ? { ...order, duyet: true } : order
          )
        )
        filterOrders(orders, filterStatus)
      } else {
        showToast('Duyệt lệnh điều chuyển thất bại!', 'error')
      }
    } catch (error) {
      console.error('Error confirming transfer order:', error)
      showToast('Không thể duyệt lệnh điều chuyển', 'error')
    }
  }

  return (
    <div className='transfer-orders'>
      <h2>Lệnh điều chuyển</h2>

      {/* Bộ lọc */}
      <div className='filter-container'>
        <div className='dropdown-container'>
          <label htmlFor='status-filter'>Trạng thái:</label>
          <select
            id='status-filter'
            value={filterStatus}
            onChange={e => handleFilterChange(e.target.value)}
          >
            <option value='Chờ xác nhận'>Chờ xác nhận</option>
            <option value='Đã xác nhận'>Đã xác nhận</option>
          </select>
        </div>

        <div className='date-picker'>
          <label htmlFor='beginDate'>Từ ngày</label>
          <Datepicker selectedDate1={beginDate || new Date().toISOString()} onDateChange={setBeginDate} />

        </div>

        <div className='date-picker'>
          <label htmlFor='endDate'>Đến ngày</label>
          <Datepicker selectedDate1={endDate || new Date().toISOString()} onDateChange={setEndDate} />
        </div>

        <button className='search-btn' onClick={handleSearch}>
          Tìm kiếm
        </button>
      </div>

      {isLoading ? (
        <Loading /> // Hiển thị component Loading khi đang tải
      ) : (
        <div className='orders-section'>
          <h3>{filterStatus}</h3>
          <table>
            <thead>
              <tr>
                <th>Ngày</th>
                <th>Tên sản phẩm</th>
                <th>Kho chuyển</th>
                <th>Kho nhận</th>
                <th>Lý do</th>
                <th>Số lượng</th>
                {filterStatus === 'Chờ xác nhận' && <th>Thao tác</th>}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                  <tr key={order._id}>
                    <td>{order.date}</td>
                    <td>{order.tensanpham}</td>
                    <td>{order.khochuyen}</td>
                    <td>{order.khonhan}</td>
                    <td>{order.lido || '(Không có lý do)'}</td>
                    <td>{order.soluong}</td>
                    {filterStatus === 'Chờ xác nhận' && (
                      <td>
                        <button
                          className='confirm-btn'
                          onClick={() => handleConfirm(order._id)}
                        >
                          Xác nhận
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='7' style={{ textAlign: 'center' }}>
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default LenhDieuChuyen
