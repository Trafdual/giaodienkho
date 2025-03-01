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
import { useNavigate } from 'react-router-dom'
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
          return value.toLocaleString('vi-VN') + 'VNĐ'
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
  const navigate = useNavigate()
  const token = sessionStorage.getItem('token') || localStorage.getItem('token')
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
  const datacustomer = [
    { name: 'David', country: 'Italy' },
    { name: 'Muhammad', country: 'India' },
    { name: 'Amelia', country: 'France' },
    { name: 'Olivia', country: 'USA' },
    { name: 'Amit', country: 'Japan' },
    { name: 'Ashraf', country: 'India' },
    { name: 'Diana', country: 'Malaysia' },
    { name: 'Amit', country: 'India' }
  ]

  useEffect(() => {
    if (!token) {
      navigate('/')
    }
  }, [token])

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newKhoID = localStorage.getItem('khoID') || ''
      if (newKhoID !== khoID) {
        console.log('Interval detected change, updating khoID:', newKhoID)
        setKhoID(newKhoID)
      }
    }, 1000)

    return () => clearInterval(intervalId)
  }, [localStorage.getItem('khoID')])

  const fetchtopkhachhang = async () => {
    try {
      const response = await fetch(
        `https://ansuataohanoi.com/topkhachhang/${khoID}`
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
      const response = await fetch(
        `https://ansuataohanoi.com/sanphamban/${khoID}`
      )
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
        `https://ansuataohanoi.com/doanhthutheothang/${khoID}`
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
              {topkhachhang.length > 0 ? (
                topkhachhang.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.phone}</td>
                    <td>{item.address}</td>
                    <td>{item.tongtien.toLocaleString()} VNĐ</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '10px'
                      }}
                    >
                      <img src='/icontop.png' alt='icon' />
                      Không có dữ liệu
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className='recentCustomers'>
          <div className='cardHeader'>
            <h2>Recent Customers</h2>
          </div>
          <table>
            <tbody>
              {datacustomer.map((user, index) => (
                <tr key={index}>
                  <td width='60px'>
                    <div className='imgBx'>
                      <img src={images.tn1} alt={user.name} />
                    </div>
                  </td>
                  <td>
                    <h4>
                      {user.name}
                      <br />
                      <span>{user.country}</span>
                    </h4>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default TestDasboard
