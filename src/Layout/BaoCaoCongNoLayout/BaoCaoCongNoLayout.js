import React, { useState, useEffect } from 'react'
import { enableColumnResizing } from '../ColumnResizer/columnResizer'
import { Loading } from '~/components/Loading'
import { useToast } from '~/components/GlobalStyles/ToastContext'
import './BaoCaoCongNo.scss'
import { useNavigate } from 'react-router-dom'
import { getApiUrl } from '../../api/api'
function BaoCaoCongNo () {
  const navigate = useNavigate()
  const today = new Date().toISOString().split('T')[0]
  const { showToast } = useToast()
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
    if (startDate > endDate) {
      showToast('Ngày bắt đầu phải nhỏ hơn ngày kết thúc', 'warning')
      return
    } else {
      setLoading(true)
      try {
        const response = await fetch(
          `${getApiUrl(
            'domain'
          )}/getcongno3/${khoID}?fromdate=${startDate}&enddate=${endDate}`
        )
        const data = await response.json()
        setData(data)
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu báo cáo kho:', error)
      } finally {
        setLoading(false)
      }
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
                Mã Khách Hàng
              </th>
              <th rowSpan='2' className='trbaocaokho'>
                Tên Khách Hàng
              </th>
              <th rowSpan='2' className='trbaocaokho'>
                Nhóm Khách Hàng
              </th>
              <th rowSpan='2' className='trbaocaokho'>
                Số điện thoại
              </th>
              <th rowSpan='2' className='trbaocaokho'>
                Nợ Đầu Kỳ
              </th>
              <th rowSpan='2' className='trbaocaokho'>
                Tăng Trong Kỳ
              </th>
              <th rowSpan='2' className='trbaocaokho'>
                Giảm Trong Kỳ
              </th>
              <th rowSpan='2' className='trbaocaokho'>
                Nợ Cuối Kỳ
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((baocao, index) => (
                <>
                  <tr key={index}>
                    <td className='trbaocaokho'>{baocao.makh}</td>
                    <td className='trbaocaokho'>{baocao.namekhach}</td>
                    <td className='trbaocaokho'>{baocao.nhomkhachhang}</td>
                    <td className='trbaocaokho'>{baocao.phone}</td>
                    <td className='trbaocaokho'>
                      {baocao.nodauky.toLocaleString()}
                    </td>
                    <td className='trbaocaokho'>
                      {baocao.tangtrongky.toLocaleString()}
                    </td>

                    <td className='trbaocaokho'>
                      {baocao.giamtrongky.toLocaleString()}
                    </td>
                    <td className='trbaocaokho'>
                      {(
                        baocao.nodauky +
                        baocao.tangtrongky -
                        baocao.giamtrongky
                      ).toLocaleString()}
                    </td>
                  </tr>
                </>
              ))
            ) : (
              <tr>
                <td
                  colSpan='8'
                  style={{ textAlign: 'center' }}
                  className='trbaocaokho'
                >
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

export default BaoCaoCongNo
