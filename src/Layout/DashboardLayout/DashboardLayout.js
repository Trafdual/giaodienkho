/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from 'react'
import { PolarArea, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale
} from 'chart.js'

import images from '../../assets/images'
import './DashboardLayout.scss'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale
)

const barOptions = {
  scales: {
    y: {
      ticks: {
        callback: function (value) {
          return value.toLocaleString('vi-VN') + 'VNĐ' // Thêm ký hiệu tiền tệ
        }
      },
      title: {
        display: true,
        text: ''
      }
    },
    x: {
      title: {
        display: true,
        text: 'Thời gian'
      }
    }
  }
}

function TestDasboard () {
  const [khoID, setKhoID] = useState(localStorage.getItem('khoID') || '')
  const [polarData, setpolarData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Số lượng máy',
        data: [],
        backgroundColor: []
      }
    ]
  })
  const [barData, setbarData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Doanh Thu',
        data: [],
        backgroundColor: []
      }
    ]
  })
  const [topkhachhang, settopkhachhang] = useState([])

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newKhoID = localStorage.getItem('khoID') || ''
      if (newKhoID !== khoID) {
        console.log('Interval detected change, updating khoID:', newKhoID)
        setKhoID(newKhoID)
      }
    }, 1000) // Kiểm tra mỗi giây

    return () => clearInterval(intervalId)
  }, [localStorage.getItem('khoID')])

  const fetchtopkhachhang = async () => {
    try {
      const response = await fetch(
        `http://localhost:3015/topkhachhang/${khoID}`
      )
      const data = await response.json()
      if (response.ok) {
        settopkhachhang(data)
      }
    } catch (error) {
      console.error('Error fetching:', error)
    }
  }

  const fetchpolarData = async () => {
    try {
      const response = await fetch(`http://localhost:3015/sanphamban/${khoID}`)
      const data = await response.json()
      if (response.ok) {
        setpolarData(data)
      }
    } catch (error) {
      console.error('Error fetching:', error)
    }
  }

  const fetchbardata = async () => {
    try {
      const response = await fetch(
        `http://localhost:3015/doanhthutheothang/${khoID}`
      )
      const data = await response.json()
      if (response.ok) {
        setbarData(data)
      }
    } catch (error) {
      console.error('Error fetching:', error)
    }
  }

  useEffect(() => {
    if (khoID) {
      fetchtopkhachhang()
      fetchpolarData()
      fetchbardata()
    }
  }, [khoID])

  return (
    <>
      <div className='graphBox'>
        <div className='box'>
          <PolarArea data={polarData} options={{ responsive: true }} />
        </div>
        <div className='box'>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      <div className='details1'>
        <div className='recentOrders1'>
          <div className='cardHeader'>
            <h2>Top khách hàng mua hàng nhiều nhất</h2>
            <a href='#' className='btn'>
              View All
            </a>
          </div>
          <table>
            <thead>
              <tr>
                <td>Họ và tên</td>
                <td>Số điện thoại</td>
                <td>Địa chỉ</td>
                <td>Tổng tiền</td>
              </tr>
            </thead>
            <tbody>
              {topkhachhang.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.phone}</td>
                  <td>{item.address}</td>
                  <td>{item.tongtien.toLocaleString()} VNĐ</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className='recentCustomers'>
          <div className='cardHeader'>
            <h2>Recent Customers</h2>
          </div>
          <table>
            <tr>
              <td width='60px'>
                <div className='imgBx'>
                  <img src={images.tn1} />
                </div>
              </td>
              <td>
                <h4>
                  David
                  <br />
                  <span>Italy</span>
                </h4>
              </td>
            </tr>
            <tr>
              <td>
                <div className='imgBx'>
                  <img src={images.tn1} />
                </div>
              </td>
              <td>
                <h4>
                  Muhammad
                  <br />
                  <span>India</span>
                </h4>
              </td>
            </tr>
            <tr>
              <td>
                <div className='imgBx'>
                  <img src={images.tn1} />
                </div>
              </td>
              <td>
                <h4>
                  Amelia
                  <br />
                  <span>France</span>
                </h4>
              </td>
            </tr>
            <tr>
              <td>
                <div className='imgBx'>
                  <img src={images.tn1} />
                </div>
              </td>
              <td>
                <h4>
                  Olivia
                  <br />
                  <span>USA</span>
                </h4>
              </td>
            </tr>
            <tr>
              <td>
                <div className='imgBx'>
                  <img src={images.tn1} />
                </div>
              </td>
              <td>
                <h4>
                  Amit
                  <br />
                  <span>Japan</span>
                </h4>
              </td>
            </tr>
            <tr>
              <td>
                <div className='imgBx'>
                  <img src={images.tn1} />
                </div>
              </td>
              <td>
                <h4>
                  Ashraf
                  <br />
                  <span>India</span>
                </h4>
              </td>
            </tr>
            <tr>
              <td>
                <div className='imgBx'>
                  <img src={images.tn1} />
                </div>
              </td>
              <td>
                <h4>
                  Diana
                  <br />
                  <span>Malaysia</span>
                </h4>
              </td>
            </tr>
            <tr>
              <td>
                <div className='imgBx'>
                  <img src={images.tn1} />
                </div>
              </td>
              <td>
                <h4>
                  Amit
                  <br />
                  <span>India</span>
                </h4>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </>
  )
}

export default TestDasboard
