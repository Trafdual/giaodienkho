import './DanhSachHoaDonLayout.scss'
import { useState, useEffect } from 'react'
import { Loading } from '~/components/Loading'
import { ModalChiTietHoaDon } from './ModalChiTietHoaDon'
import { PaginationComponent } from '~/components/NextPage'
import { useNavigate } from 'react-router-dom'
import { getApiUrl } from '../../api/api'
import { getFromLocalStorage } from '../../components/MaHoaLocalStorage/MaHoaLocalStorage'

function DanhSachHoaDonLayout () {
  const navigate = useNavigate()
  const formatDate = date => {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const [data, setdata] = useState([])
  const [fromdate, setfromdate] = useState(formatDate(new Date()))
  const [enddate, setenddate] = useState(formatDate(new Date()))
  const [isOpenChiTiet, setIsOpenChiTiet] = useState(false)
  const [idhoadon, setidhoadon] = useState('')
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [currentPage, setCurrentPage] = useState(1)

  const [khoID, setKhoID] = useState(localStorage.getItem('khoID') || '')
  const [loading, setLoading] = useState(false)

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem)

  const totalPages = Math.ceil(data.length / itemsPerPage)
  const totalResults = data.length
  const handlePageChange = page => {
    setCurrentPage(page)
  }

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

  const fetchhoadon = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `${getApiUrl(
          'domain'
        )}/gethoadonstore/${khoID}?fromdate=${fromdate}&enddate=${enddate}`
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
    <div className='danh-sach-hoa-don-layout'>
      {loading && <Loading />}

      <div className='header'>
        <div className='filters'>
          <select>
            <option>Ngày tạo</option>
          </select>
          <select>
            <option>14 ngày gần đây</option>
          </select>
          <input
            type='date'
            value={fromdate}
            onChange={e => setfromdate(e.target.value)}
          />
          <span>-</span>
          <input
            type='date'
            value={enddate}
            onChange={e => setenddate(e.target.value)}
          />
          <button className='btnsearchhoadon' onClick={fetchhoadon}>
            Tìm kiếm
          </button>
        </div>
        <div className='actions'>
          <button className='settings-button'>⚙️</button>
        </div>
      </div>

      <div className='table-container'>
        <table>
          <thead>
            <tr>
              <th>Số hóa đơn</th>
              <th>Ngày hóa đơn</th>
              <th>Ngày tạo đơn</th>
              <th>Mã ĐH trên sàn</th>
              <th>Trạng thái</th>
              <th>Mã khách hàng</th>
              <th>Khách hàng</th>
              <th>Số điện thoại</th>
              <th>Tổng thanh toán</th>
              <th>Ghi chú</th>
              <th>NVBH</th>
              <th>Thu ngân</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map(item => (
                <tr
                  onClick={() => {
                    setIsOpenChiTiet(true)
                    setidhoadon(item._id)
                  }}
                >
                  <td style={{ color: 'var(--blue)', fontWeight: 'bold' }}>
                    {item.mahd}
                  </td>
                  <td>{item.date}</td>
                  <td>{item.date}</td>
                  <td></td>
                  {!item.ghino ? (
                    <td>
                      <span className='status success'>Đã thanh toán</span>
                    </td>
                  ) : (
                    <td>
                      <span className='status ghino'>Ghi nợ</span>
                    </td>
                  )}
                  <td>{item.makh}</td>
                  <td>{item.namekh}</td>
                  <td>{item.phone}</td>
                  <td>{item.tongtien.toLocaleString()}</td>
                  <td></td>
                  <td>Nguyễn Ngọc Ánh</td>
                  <td>Hà thu ngân chuối</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={12} style={{ textAlign: 'center' }}>
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className='pagination'>
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
      <ModalChiTietHoaDon
        isOpen={isOpenChiTiet}
        onClose={() => setIsOpenChiTiet(false)}
        idhoadon={idhoadon}
      />
    </div>
  )
}

export default DanhSachHoaDonLayout
