import React, { useState, useEffect } from 'react'
import './BaoCaoKhoLayout.scss'
import { enableColumnResizing } from '../ColumnResizer/columnResizer'
import { Loading } from '~/components/Loading'
import { useNavigate } from 'react-router-dom'

function BaoCaoKhoLayout () {
  const navigate = useNavigate()
  const today = new Date().toISOString().split('T')[0]

  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(today)
  const [data, setData] = useState([])
  const [khoID, setKhoID] = useState(localStorage.getItem('khoID') || '')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token =
      sessionStorage.getItem('token') || localStorage.getItem('token')
    if (!token) {
      navigate('/')
    }
  }, [navigate])

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

  const HandleGetBaoCao = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `https://baotech.shop/getsptest/${khoID}?fromDate=${startDate}&endDate=${endDate}`
      )
      const data = await response.json()
      setData(data)
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu báo cáo kho:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    enableColumnResizing('.tablebaocaokho')
  }, [])

  return (
    <div className='baocaokho-container'>
      {loading && <Loading />}
      <div className='divdatetongcn'>
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
        <div className='btnlaydl'>
          <button className='btn-get-data' onClick={HandleGetBaoCao}>
            Lấy dữ liệu
          </button>
        </div>
      </div>
      <div className='table-container'>
        <table
          style={{ width: '100%', borderCollapse: 'collapse' }}
          className='tablebaocaokho'
        >
          <thead>
            <tr>
              <th rowSpan='2' className='trbaocaokho'>
                Mã SKU
              </th>
              <th rowSpan='2' className='trbaocaokho'>
                Tên hàng hóa
              </th>
              <th colSpan='2' className='trbaocaokho'>
                Tồn đầu kỳ
              </th>
              <th colSpan='2' className='trbaocaokho'>
                Nhập trong kỳ
              </th>
              <th colSpan='2' className='trbaocaokho'>
                Xuất trong kỳ
              </th>
              <th colSpan='2' className='trbaocaokho'>
                Tồn cuối kỳ
              </th>
            </tr>
            <tr>
              <th className='thbaocaokho'>Số lượng</th>
              <th className='thbaocaokho'>Giá trị</th>
              <th className='thbaocaokho'>Số lượng</th>
              <th className='thbaocaokho'>Giá trị</th>
              <th className='thbaocaokho'>Số lượng</th>
              <th className='thbaocaokho'>Giá trị</th>
              <th className='thbaocaokho'>Số lượng</th>
              <th className='thbaocaokho'>Giá trị</th>
            </tr>
          </thead>
          <tbody>
            {data.length ? (
              data.map((baocao, index) => (
                <>
                  <tr key={index}>
                    <td className='trbaocaokho'>{baocao.masku}</td>
                    <td className='trbaocaokho'>{baocao.namesku}</td>
                    <td className='trbaocaokho'>{baocao.tongtondau.soluong}</td>
                    <td className='trbaocaokho'>
                      {baocao.tongtondau.price.toLocaleString()}
                    </td>
                    <td className='trbaocaokho'>
                      {baocao.tongnhaptrong.soluong}
                    </td>
                    <td className='trbaocaokho'>
                      {baocao.tongnhaptrong.price.toLocaleString()}
                    </td>
                    <td className='trbaocaokho'>
                      {baocao.tongxuattrong.soluong}
                    </td>
                    <td className='trbaocaokho'>
                      {baocao.tongxuattrong.price.toLocaleString()}
                    </td>
                    <td className='trbaocaokho'>
                      {baocao.tongtoncuoiky.soluong}
                    </td>
                    <td className='trbaocaokho'>
                      {baocao.tongtoncuoiky.price.toLocaleString()}
                    </td>
                  </tr>
                  {baocao.sanpham.map((sanpham, row) => (
                    <tr key={row}>
                      <td className='trbaocaosanphamkho'>
                        {sanpham.madungluongsku}
                      </td>
                      <td className='trbaocaosanphamkho'>{sanpham.name}</td>
                      <td className='trbaocaosanphamkho'>
                        {sanpham.tondauky.soluong}
                      </td>
                      <td className='trbaocaosanphamkho'>
                        {sanpham.tondauky.price.toLocaleString()}
                      </td>
                      <td className='trbaocaosanphamkho'>
                        {sanpham.nhaptrongky.soluong}
                      </td>
                      <td className='trbaocaosanphamkho'>
                        {sanpham.nhaptrongky.price.toLocaleString()}
                      </td>
                      <td className='trbaocaosanphamkho'>
                        {sanpham.xuattrongky.soluong}
                      </td>
                      <td className='trbaocaosanphamkho'>
                        {sanpham.xuattrongky.price.toLocaleString()}
                      </td>
                      <td className='trbaocaosanphamkho'>
                        {sanpham.toncuoiky.soluong}
                      </td>
                      <td className='trbaocaosanphamkho'>
                        {sanpham.toncuoiky.price.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </>
              ))
            ) : (
              <tr>
                <td className='trbaocaosanphamkho' colSpan='10'>
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default BaoCaoKhoLayout
