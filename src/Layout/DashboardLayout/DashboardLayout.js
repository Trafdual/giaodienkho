/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
import {
  faCartShopping,
  faComments,
  faEye,
  faMoneyBills
} from '@fortawesome/free-solid-svg-icons'

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

const polarData = {
  labels: ['Iphone 13 pro max', 'Iphone 14 pro max', 'Iphone 15 pro max'],
  datasets: [
    {
      label: 'Số lượng máy',
      data: [3300, 1500, 2205],
      backgroundColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)'
      ]
    }
  ]
}

const barData = {
  labels: [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12'
  ],
  datasets: [
    {
      label: 'Doanh Thu',
      data: [
        10000000000, 9000000000, 12000000000, 8000000000, 13000000000,
        5000000000, 9000000000, 10000000000, 7000000000, 6000000000, 5000000000,
        1122000000000
      ],
      backgroundColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ]
    }
  ]
}

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
  return (
    <>
      <div className='cardBox'>
        <div className='card'>
          <div>
            <div className='numbers'>1,504</div>
            <div className='cardName'>Daily Views</div>
          </div>
          <div className='iconBx'>
            <FontAwesomeIcon icon={faEye} />
          </div>
        </div>
        <div className='card'>
          <div>
            <div className='numbers'>80</div>
            <div className='cardName'>Sales</div>
          </div>
          <div className='iconBx'>
            <FontAwesomeIcon icon={faCartShopping} />
          </div>
        </div>
        <div className='card'>
          <div>
            <div className='numbers'>284</div>
            <div className='cardName'>Comments</div>
          </div>
          <div className='iconBx'>
            <FontAwesomeIcon icon={faComments} />
          </div>
        </div>
        <div className='card'>
          <div>
            <div className='numbers'>$7,842</div>
            <div className='cardName'>Earning</div>
          </div>
          <div className='iconBx'>
            <FontAwesomeIcon icon={faMoneyBills} />
          </div>
        </div>
      </div>

      <div className='graphBox'>
        <div className='box'>
          <PolarArea data={polarData} options={{ responsive: true }} />
        </div>
        <div className='box'>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      <div className='details'>
        <div className='recentOrders'>
          <div className='cardHeader'>
            <h2>Recent Orders</h2>
            <a href='#' className='btn'>
              View All
            </a>
          </div>
          <table>
            <thead>
              <tr>
                <td>Name</td>
                <td>Price</td>
                <td>Payment</td>
                <td>Status</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Star Refrigerator</td>
                <td>$1200</td>
                <td>Paid</td>
                <td>
                  <span className='status delivered'>Delivered</span>
                </td>
              </tr>
              <tr>
                <td>Window Coolers</td>
                <td>$110</td>
                <td>Due</td>
                <td>
                  <span className='status pending'>Pending</span>
                </td>
              </tr>
              <tr>
                <td>Speakers</td>
                <td>$620</td>
                <td>Paid</td>
                <td>
                  <span className='status return'>Return</span>
                </td>
              </tr>
              <tr>
                <td>Hp Laptop</td>
                <td>$110</td>
                <td>Due</td>
                <td>
                  <span className='status inprogress'>In Progress</span>
                </td>
              </tr>
              <tr>
                <td>Apple Watch</td>
                <td>$1200</td>
                <td>Paid</td>
                <td>
                  <span className='status delivered'>Delivered</span>
                </td>
              </tr>
              <tr>
                <td>Wall Fan</td>
                <td>$110</td>
                <td>Paid</td>
                <td>
                  <span className='status pending'>Pending</span>
                </td>
              </tr>
              <tr>
                <td>Adidas Shoes</td>
                <td>$620</td>
                <td>Paid</td>
                <td>
                  <span className='status return'>Return</span>
                </td>
              </tr>
              <tr>
                <td>Denim Shirts</td>
                <td>$110</td>
                <td>Due</td>
                <td>
                  <span className='status inprogress'>In Progress</span>
                </td>
              </tr>
              <tr>
                <td>Casual Shoes</td>
                <td>$575</td>
                <td>Paid</td>
                <td>
                  <span className='status pending'>Pending</span>
                </td>
              </tr>
              <tr>
                <td>Wall Fan</td>
                <td>$110</td>
                <td>Paid</td>
                <td>
                  <span className='status pending'>Pending</span>
                </td>
              </tr>
              <tr>
                <td>Denim Shirts</td>
                <td>$110</td>
                <td>Due</td>
                <td>
                  <span className='status inprogress'>In Progress</span>
                </td>
              </tr>
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
