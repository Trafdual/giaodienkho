/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import './Sidebar.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChartPie,
  faCircleQuestion,
  faGear,
  faHandshake,
  faHouse,
  faLandmark,
  faRightFromBracket,
  faWarehouse,
  faChevronUp,
  faChevronDown,
  faWrench,
  faShieldHalved,
  faTruckFast,
  faMoneyBill,
  faMoneyCheck,
  faWallet,
  faCartShopping,
  faMoneyBillTrendUp
} from '@fortawesome/free-solid-svg-icons'
import { publicRoutes } from '../../../router'
import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ModalDangXuat } from './ModalDangXuat'

function Sidebar ({ isActive, setIsActive }) {
  const location = useLocation()
  const [activeItem, setActiveItem] = useState('')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [dropdownState, setDropdownState] = useState({
    isDropdownOpen: false,
    isDropdownOpenBaoCao: false,
    isDropdownOpenKho: false,
    isDropdownOpenQuyTien: false
  })

  const [isModalDangXuat, setIsModalDangXuat] = useState(false)
  const [soluonglenh, setsoluonglenh] = useState(0)
  const khoID = localStorage.getItem('khoID')

  const toggleDropdown = key => {
    setDropdownState(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  useEffect(() => {
    const savedActiveItem = localStorage.getItem('activeItem')
    if (savedActiveItem && savedActiveItem === location.pathname) {
      setActiveItem(savedActiveItem)
    } else {
      setActiveItem(location.pathname)
      localStorage.setItem('activeItem', location.pathname)
    }
  }, [location.pathname])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsMobile(window.innerWidth <= 768)
      } else {
        setIsMobile(window.innerWidth >= 768)
      }
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    sessionStorage.clear()
    window.history.replaceState(null, '', publicRoutes[0].path)
    window.location.reload()
  }

  const handleItemClick = path => {
    setActiveItem(path)
    if (isMobile) {
      setIsActive(false)
    }
    localStorage.setItem('activeItem', path)
  }

  const fetchsoluonglenh = async () => {
    try {
      const response = await fetch(`http://localhost:3015/soluonglenh/${khoID}`)
      const data = await response.json()
      if (response.ok) {
        setsoluonglenh(data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchsoluonglenh()
  }, [khoID])

  const menuItems = [
    {
      path: '/home',
      title: 'Tổng quan',
      icon: faHouse
    },
    {
      title: 'Báo cáo',
      icon: faChartPie,
      dropdownKey: 'isDropdownOpenBaoCao',
      children: [
        {
          path: '/doanhthu',
          title: 'Doanh Thu',
          icon: faMoneyBillTrendUp
        },
        {
          path: '/baocaokho',
          title: 'Kho',
          icon: faLandmark
        },
        {
          path: '/baocaobanhang',
          title: 'Bán hàng',
          icon: faCartShopping
        },
        {
          path: '/baocaocongno',
          title: 'Công nợ',
          icon: faMoneyBill
        }
      ]
    },
    {
      path: '/nhacungcap',
      title: 'Nhà cung cấp',
      icon: faHandshake
    },
    {
      title: 'Kho',
      icon: faLandmark,
      dropdownKey: 'isDropdownOpenKho',
      children: [
        {
          path: '/nhapkho',
          title: 'Nhập Kho',
          icon: faLandmark
        },
        {
          path: '/xuatkho',
          title: 'Xuất Kho',
          icon: faWarehouse
        },
        {
          path: '/lenhdieuchuyen',
          title: 'Lệnh điều chuyển',
          icon: faTruckFast,
          badge: true
        }
      ]
    },
    {
      title: 'Quỹ tiền',
      icon: faWallet,
      dropdownKey: 'isDropdownOpenQuyTien',
      children: [
        {
          path: '/quytienmat',
          title: 'Thu, chi tiền mặt',
          icon: faMoneyBill
        },
        {
          path: '/quytiengui',
          title: 'Thu, chi tiền gửi',
          icon: faMoneyCheck
        }
      ]
    },
    {
      path: '/banhang',
      title: 'Bán Hàng',
      icon: faCartShopping
    },
    {
      path: '/trogiuptongquan',
      title: 'Trợ giúp',
      icon: faCircleQuestion
    },
    {
      title: 'Thiết lập',
      icon: faGear,
      dropdownKey: 'isDropdownOpen',
      children: [
        {
          path: '/thietlap',
          title: 'Cấu hình',
          icon: faWrench
        },
        {
          path: '/thietlap/baomat',
          title: 'Bảo mật',
          icon: faShieldHalved
        }
      ]
    },
    {
      title: 'Đăng Xuất',
      icon: faRightFromBracket,
      onClick: () => setIsModalDangXuat(true)
    }
  ]

  return (
    <div className={`navigation ${isActive ? 'active' : ''}`}>
      <div className='a'>
        <a href='#' className='link'>
          <img
            className='fonticon'
            src={require('../../../assets/images/LOGO.png')}
            alt='icon'
          />
          <span className='title'>BICRAFT</span>
        </a>
      </div>

      <ul>
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={`${item.dropdownKey ? 'litong1' : 'litong'} ${
              activeItem === item.path ? 'hovered' : ''
            }`}
            onClick={() => {
              if (item.onClick) item.onClick()
              else if (item.path) handleItemClick(item.path)
            }}
          >
            {item.path || item.onClick ? (
              <Link to={item.path}>
                <span className='icon'>
                  <FontAwesomeIcon className='fonticon' icon={item.icon} />
                </span>
                <span className='title'>{item.title}</span>
                {item.badge && (
                  <span className='soluonglenh'>{soluonglenh.soluonglenh}</span>
                )}
              </Link>
            ) : (
              <a onClick={() => toggleDropdown(item.dropdownKey)}>
                <span className='icon'>
                  <FontAwesomeIcon className='fonticon' icon={item.icon} />
                </span>
                <span className='title'>{item.title}</span>
                <FontAwesomeIcon
                  icon={
                    dropdownState[item.dropdownKey]
                      ? faChevronUp
                      : faChevronDown
                  }
                  className='dropdown-icon'
                />
              </a>
            )}

            {item.children && dropdownState[item.dropdownKey] && (
              <ul className='dropdown-menu'>
                {item.children.map((child, childIndex) => (
                  <li
                    key={childIndex}
                    className={`litong ${
                      activeItem === child.path ? 'hovered' : ''
                    }`}
                    onClick={() => handleItemClick(child.path)}
                  >
                    <Link to={child.path}>
                      <span className='icon'>
                        <FontAwesomeIcon
                          className='fonticon'
                          icon={child.icon}
                        />
                      </span>
                      <span className='title'>{child.title}</span>
                      {child.badge && (
                        <span className='soluonglenh'>
                          {soluonglenh.soluonglenh}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      <ModalDangXuat
        dangxuat={handleLogout}
        isOpen={isModalDangXuat}
        Cancel={() => setIsModalDangXuat(false)}
      />
    </div>
  )
}

export default Sidebar
