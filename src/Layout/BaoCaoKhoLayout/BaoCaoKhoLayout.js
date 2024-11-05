import React, { useState, useEffect } from 'react'
import './BaoCaoKhoLayout.scss'
import { enableColumnResizing } from '../ColumnResizer/columnResizer'


function BaoCaoKhoLayout () {
  const today = new Date().toISOString().split('T')[0]

  const [startDate, setStartDate] = useState(today) // Quản lý ngày bắt đầu
  const [endDate, setEndDate] = useState(today) // Quản lý ngày kết thúc
  const [data, setdata] = useState([])
  const [khoID, setKhoID] = useState(localStorage.getItem('khoID') || '')
  console.log(startDate)

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

  const HandleGetBaoCao = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/getsptest/${khoID}?fromDate=${startDate}&endDate=${endDate}`
      )
      const data = await response.json()
      setdata(data)
      console.log('Dữ liệu báo cáo kho:', data)
    } catch (error) {
      console.error(' khi lấy dữ liệu báo cáo kho:', error)
    }
  }

  useEffect(() => {
  enableColumnResizing('.tablebaocaokho')
}, [])


  return (
    <div className='baocaokho-container'>
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
        <button className='btn-get-data' onClick={HandleGetBaoCao}>
          Lấy dữ liệu
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }} className='tablebaocaokho'>
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
          {data.map((baocao, index) => (
            <>
              <tr key={index}>
                <td className='trbaocaokho'>{baocao.masku}</td>
                <td className='trbaocaokho'>{baocao.namesku}</td>
                <td className='trbaocaokho'>{baocao.tongtondau.soluong}</td>
                <td className='trbaocaokho'>
                  {baocao.tongtondau.price.toLocaleString()}
                </td>
                <td className='trbaocaokho'>{baocao.tongnhaptrong.soluong}</td>
                <td className='trbaocaokho'>
                  {baocao.tongnhaptrong.price.toLocaleString()}
                </td>
                <td className='trbaocaokho'>{baocao.tongxuattrong.soluong}</td>
                <td className='trbaocaokho'>
                  {baocao.tongxuattrong.price.toLocaleString()}
                </td>
                <td className='trbaocaokho'>{baocao.tongtoncuoiky.soluong}</td>
                <td className='trbaocaokho'>
                  {baocao.tongtoncuoiky.price.toLocaleString()}
                </td>
              </tr>
              {baocao.sanpham.map((sanpham, row) => (
                <tr key={row}>
                  <td className='trbaocaosanphamkho'>{sanpham.madungluongsku}</td>
                  <td className='trbaocaosanphamkho'>{sanpham.name}</td>
                  <td className='trbaocaosanphamkho'>{sanpham.tondauky.soluong}</td>
                  <td className='trbaocaosanphamkho'>
                    {sanpham.tondauky.price.toLocaleString()}
                  </td>
                  <td className='trbaocaosanphamkho'>{sanpham.nhaptrongky.soluong}</td>
                  <td className='trbaocaosanphamkho'>
                    {sanpham.nhaptrongky.price.toLocaleString()}
                  </td>
                  <td className='trbaocaosanphamkho'>{sanpham.xuattrongky.soluong}</td>
                  <td className='trbaocaosanphamkho'>
                    {sanpham.xuattrongky.price.toLocaleString()}
                  </td>
                  <td className='trbaocaosanphamkho'>{sanpham.toncuoiky.soluong}</td>
                  <td className='trbaocaosanphamkho'>
                    {sanpham.toncuoiky.price.toLocaleString()}
                  </td>
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default BaoCaoKhoLayout
