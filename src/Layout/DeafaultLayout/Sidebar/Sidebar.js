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
  faMoneyBillTrendUp,
  faUsers,
  faCircleUser,
  faUsersSlash,
  faGears,
  faBuildingColumns,
  faBook
} from '@fortawesome/free-solid-svg-icons'
import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ModalDangXuat } from './ModalDangXuat'
import { useToast } from '~/components/GlobalStyles/ToastContext'
import { getFromLocalStorage } from '../../../components/MaHoaLocalStorage/MaHoaLocalStorage'
import { getApiUrl } from '../../../api/api'

function Sidebar ({ isActive, setIsActive }) {
  const { showToast } = useToast()
  const { pathname } = useLocation()
  const [activeItem, setActiveItem] = useState(pathname)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [dropdownState, setDropdownState] = useState({})
  const [isModalDangXuat, setIsModalDangXuat] = useState(false)
  const [soluonglenh, setSoluonglenh] = useState(0)
  const khoID = localStorage.getItem('khoID')
  const userdata = getFromLocalStorage('data')

  const toggleDropdown = key => {
    setDropdownState(prev => {
      const newState = Object.keys(prev).reduce(
        (acc, curr) => ({
          ...acc,
          [curr]: false
        }),
        {}
      )
      return { ...newState, [key]: !prev[key] }
    })
  }

  useEffect(() => {
    setActiveItem(pathname)
    localStorage.setItem('activeItem', pathname)
  }, [pathname])

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    sessionStorage.clear()
    window.location.href = '/'
  }

  const handleItemClick = path => {
    setActiveItem(path)
    if (isMobile) setIsActive(false)
    localStorage.setItem('activeItem', path)
  }

  useEffect(() => {
    if (!khoID) return
    fetch(`${getApiUrl('domain')}/soluonglenh/${khoID}`)
      .then(res => res.json())
      .then(data =>
        data.error ? showToast(data.error, 'error') : setSoluonglenh(data)
      )
      .catch(err => console.error('Error:', err))
  }, [khoID, showToast])

  const menuItems = [
    { path: '/home', title: 'Tổng quan', icon: faHouse },
    userdata?.data?.user[0]?.role === 'manager' && {
      title: 'Nhân viên',
      icon: faCircleUser,
      dropdownKey: 'isDropdownOpenNhanVien',
      children: [
        { path: '/nhanvien/active', title: 'Đang hoạt động', icon: faUsers },
        { path: '/nhanvien/locked', title: 'Đã bị khóa', icon: faUsersSlash }
      ]
    },
    userdata?.data?.user[0]?.role === 'manager' && {
      title: 'Cài đặt chung',
      icon: faGears,
      dropdownKey: 'isDropdownsetting',
      children: [
        { path: '/setting/sku', title: 'Sku', icon: faUsers },
        { path: '/setting/bank', title: 'Ngân hàng', icon: faBuildingColumns },
        { path: '/setting/mucthuchi', title: 'Mục thu chi', icon: faMoneyCheck },
        { path: '/setting/loaichungtu', title: 'Loại chứng từ', icon: faBook },
        { path: '/setting/nhomkhachhang', title: 'Nhóm khách hàng', icon: faUsers }
      ]
    },
    {
      title: 'Báo cáo',
      icon: faChartPie,
      dropdownKey: 'isDropdownOpenBaoCao',
      children: [
        { path: '/doanhthu', title: 'Doanh Thu', icon: faMoneyBillTrendUp },
        { path: '/baocaokho', title: 'Kho', icon: faLandmark },
        { path: '/baocaobanhang', title: 'Bán hàng', icon: faCartShopping },
        { path: '/baocaocongno', title: 'Công nợ', icon: faMoneyBill }
      ]
    },
    { path: '/nhacungcap', title: 'Nhà cung cấp', icon: faHandshake },
    {
      title: 'Kho',
      icon: faLandmark,
      dropdownKey: 'isDropdownOpenKho',
      children: [
        { path: '/nhapkho', title: 'Nhập Kho', icon: faLandmark },
        { path: '/xuatkho', title: 'Xuất Kho', icon: faWarehouse },
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
        { path: '/quytienmat', title: 'Thu, chi tiền mặt', icon: faMoneyBill },
        { path: '/quytiengui', title: 'Thu, chi tiền gửi', icon: faMoneyCheck }
      ]
    },
    { path: '/banhang', title: 'Bán Hàng', icon: faCartShopping },
    { path: '/trogiuptongquan', title: 'Trợ giúp', icon: faCircleQuestion },
    // {
    //   title: 'Thiết lập',
    //   icon: faGear,
    //   dropdownKey: 'isDropdownOpen',
    //   children: [
    //     { path: '/thietlap', title: 'Cấu hình', icon: faWrench },
    //     { path: '/thietlap/baomat', title: 'Bảo mật', icon: faShieldHalved }
    //   ]
    // },
    {
      title: 'Đăng Xuất',
      icon: faRightFromBracket,
      onClick: () => setIsModalDangXuat(true)
    }
  ].filter(Boolean)

  return (
    <div className={`navigation ${isActive ? 'active' : ''}`}>
      <div className='a'>
        <a href='#' className='link'>
          <img
            className='fonticon'
            src={require('../../../assets/images/LOGO.png')}
            alt='icon'
          />
          <span className='title'>BAOTECH</span>
        </a>
      </div>
      <ul>
        {menuItems.map((item, i) => (
          <li
            key={i}
            className={`${item.dropdownKey ? 'litong1' : 'litong'} ${
              activeItem === item.path ? 'hovered' : ''
            }`}
            onClick={() =>
              item.onClick
                ? item.onClick()
                : item.path && handleItemClick(item.path)
            }
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
              <a
                onClick={e => {
                  e.preventDefault()
                  toggleDropdown(item.dropdownKey)
                }}
                href='#'
              >
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
                {item.children.map((child, j) => (
                  <li
                    key={j}
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
