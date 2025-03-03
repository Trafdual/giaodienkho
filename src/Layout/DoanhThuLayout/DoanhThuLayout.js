import React, { useState, useEffect } from 'react'
import './DoanhThuLayout.scss'
import { Loading } from '~/components/Loading'
import { useNavigate } from 'react-router-dom'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

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
  const [isExporting, setIsExporting] = useState(false)

  const khoID = localStorage.getItem('khoID')

  const navigate = useNavigate()

  useEffect(() => {
    const token =
      sessionStorage.getItem('token') || localStorage.getItem('token')
    if (!token) {
      navigate('/')
    }
  }, [navigate])

  const handleDoanhThu = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `http://localhost:3015/getdoanhthu/${khoID}?fromDate=${startDate}&endDate=${endDate}&fromDatetruoc=${startDatetruoc}&endDatetruoc=${endDatetruoc}`,
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

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet([data])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'DoanhThu')
    XLSX.writeFile(wb, 'DoanhThu.xlsx')
  }

  const handleExportPDF = async () => {
    setIsExporting(true)
    await new Promise(resolve => setTimeout(resolve, 300))

    const element = document.querySelector('.doanh-thu-layout')

    if (!element) return

    const buttons = element.querySelectorAll('button')
    buttons.forEach(btn => (btn.style.display = 'none'))

    try {
      const canvas = await html2canvas(element, { scale: 2 })
      const imgData = canvas.toDataURL('image/png')

      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)

      const pdfBlob = pdf.output('blob')
      const pdfURL = URL.createObjectURL(pdfBlob)
      window.open(pdfURL)
      setIsExporting(false)
    } catch (error) {
      console.error('Lỗi khi xuất PDF:', error)
    } finally {
      buttons.forEach(btn => (btn.style.display = ''))
    }
  }

  const handelphantram = (a, b) => {
    if (!b) return 0
    const phantram = (a / b) * 100 - 100
    return phantram.toFixed(1)
  }

  return (
    <div className='doanh-thu-layout'>
      {loading && <Loading />}
      <div className='filter-section'>
        <div className='filter-group'>
          <label>Kỳ:</label>
          {isExporting ? (
            <span>Kỳ trước</span>
          ) : (
            <select
              value={currentPeriod}
              onChange={e => setCurrentPeriod(e.target.value)}
            >
              <option value='Kỳ trước'>Kỳ trước</option>
            </select>
          )}
        </div>

        <div className='date-filter'>
          <div className='divtungay'>
            <label>Từ ngày:</label>
            {isExporting ? (
              <span>{startDatetruoc || '...'}</span>
            ) : (
              <input
                type='date'
                value={startDatetruoc}
                onChange={e => setStartDatetruoc(e.target.value)}
              />
            )}
          </div>

          <div className='divdenngay'>
            <label>Đến ngày:</label>
            {isExporting ? (
              <span>{endDatetruoc || '...'}</span>
            ) : (
              <input
                type='date'
                value={endDatetruoc}
                onChange={e => setendDatetruoc(e.target.value)}
              />
            )}
          </div>
        </div>
      </div>
      
      <div className='filter-section'>
        <div className='filter-group'>
          <label>Kỳ:</label>
          {isExporting ? (
            <span>Kỳ hiện tại</span>
          ) : (
            <select
              value={currentPeriod}
              onChange={e => setCurrentPeriod(e.target.value)}
            >
              <option value='Kỳ trước'>Kỳ hiện tại</option>
            </select>
          )}
        </div>

        <div className='date-filter'>
          <div className='divtungay'>
            <label>Từ ngày:</label>
            {isExporting ? (
              <span>{startDate || '...'}</span>
            ) : (
              <input
                type='date'
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
              />
            )}
          </div>

          <div className='divdenngay'>
            <label>Đến ngày:</label>
            {isExporting ? (
              <span>{endDate || '...'}</span>
            ) : (
              <input
                type='date'
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
              />
            )}
          </div>
          <button className='btn-get-data' onClick={handleDoanhThu}>
            Lấy dữ liệu
          </button>
        </div>
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
                {data.tongThuChitruoc
                  ? data.tongThuChitruoc.toLocaleString()
                  : 0}
              </td>
              <td>{data.tongThuChi ? data.tongThuChi.toLocaleString() : 0}</td>
              <td>
                {isNaN(handelphantram(data.tongThuChi, data.tongThuChitruoc))
                  ? 0
                  : handelphantram(data.tongThuChi, data.tongThuChitruoc)}
              </td>
              <td>
                {parseFloat(data.tongThuChi - data.tongThuChitruoc)
                  ? parseFloat(
                      data.tongThuChi - data.tongThuChitruoc
                    ).toLocaleString()
                  : 0}
              </td>
            </tr>

            <tr>
              <td colSpan='5'>
                <strong>III. Công nợ</strong>
              </td>
            </tr>
            <tr>
              <td>Công nợ</td>
              <td>
                {data.tongCongNoTruoc
                  ? data.tongCongNoTruoc.toLocaleString()
                  : 0}
              </td>
              <td>{data.tongCongNo ? data.tongCongNo.toLocaleString() : 0}</td>
              <td>
                {isNaN(handelphantram(data.tongCongNo, data.tongCongNoTruoc))
                  ? 0
                  : handelphantram(data.tongCongNo, data.tongCongNoTruoc)}
              </td>

              <td>
                {parseFloat(data.tongCongNo - data.tongCongNoTruoc)
                  ? parseFloat(
                      data.tongCongNo - data.tongCongNoTruoc
                    ).toLocaleString()
                  : 0}
              </td>
            </tr>

            <tr>
              <td colSpan='5'>
                <strong>IV. Lợi nhuận</strong>
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
        <button className='btn-print' onClick={handleExportPDF}>
          In
        </button>
        <button className='btn-export' onClick={handleExportExcel}>
          Xuất Excel
        </button>
      </div>
    </div>
  )
}

export default DoanhThuLayout
