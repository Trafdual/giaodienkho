/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { getApiUrl } from '../../../api/api'
import { PaginationComponent } from '../../../components/NextPage'
import Datepicker from '../../../components/Calendar/DatePicker'
function PhieuThuLayout ({ khoID }) {
  const [data, setdata] = useState([])

  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [currentPage, setCurrentPage] = useState(1)
  const [beginDate, setBeginDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const fetchhoadon = async () => {
    try {
      const response = await fetch(
        `${getApiUrl('domain')}/getphieuthu/${khoID}`
      )
      if (response.ok) {
        const data = await response.json()
        setdata(data)
      }
    } catch (error) {
      console.error('Error fetching:', error)
    }
  }

  const fetchngay = async () => {
    try {
      const response = await fetch(
        `${getApiUrl(
          'domain'
        )}/getphieuthutheodate/${khoID}?startDate=${beginDate}&&endDate=${endDate}`
      )
      if (response.ok) {
        const data = await response.json()
        setdata(data)
      }
    } catch (error) {
      console.error('Error fetching:', error)
    }
  }

  useEffect(() => {
    if (khoID) {
      fetchhoadon()
    }
  }, [khoID])

  useEffect(() => {
    if (khoID && beginDate && endDate) {
      fetchngay()
    }
  }, [khoID, endDate, beginDate])

  const totalPages = Math.ceil(data.length / itemsPerPage)
  const totalResults = data.length
  const handlePageChange = page => {
    setCurrentPage(page)
  }

  return (
    <>
      <div className='divdate1'>
        <div className='date-picker'>
          <label htmlFor='beginDate'>Từ ngày</label>
          <Datepicker
            selectedDate1={beginDate || new Date().toISOString()}
            onDateChange={setBeginDate}
          />
        </div>

        <div className='date-picker'>
          <label htmlFor='endDate'>Đến ngày</label>
          <Datepicker
            selectedDate1={endDate || new Date().toISOString()}
            onDateChange={setEndDate}
          />
        </div>
      </div>

      <div className='tab-content-container'>
        <div className='divtablethuno'>
          <table className='thu-no-table'>
            <thead>
              <tr className='trthuno'>
                <th className='text-left'>Mã phiếu thu</th>
                <th>Ngày</th>
                <th>Loại chứng từ</th>
                <th>Đối tượng</th>
                <th>Phương thức</th>
                <th>Diễn giải</th>
                <th className='text-right'>Tổng tiền</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td className='text-left'>{item.mathuchi}</td>
                  <td>{item.date}</td>
                  <td>{item.loaichungtu}</td>
                  <td>{item.doituong}</td>
                  <td>{item.method}</td>
                  <td>{item.lydo}</td>
                  <td className='text-right'>
                    {item.tongtien.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className='pagination1'>
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
    </>
  )
}

export default PhieuThuLayout
