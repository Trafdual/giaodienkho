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
  faShieldHalved
} from '@fortawesome/free-solid-svg-icons'
import { publicRoutes } from '../../../router'
import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

function Sidebar ({ isActive, setIsActive }) {
  const location = useLocation()
  const [activeItem, setActiveItem] = useState('')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  // Lấy trạng thái active từ localStorage khi trang load
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
        // Giả sử 768px là kích thước cắt của điện thoại
        setIsMobile(window.innerWidth <= 768)
      } else {
        setIsMobile(window.innerWidth >= 768)
      }
    }

    // Gọi hàm khi trang được tải
    handleResize()

    // Thay đổi itemsPerPage khi kích thước cửa sổ thay đổi
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    sessionStorage.clear()
    window.history.replaceState(null, '', publicRoutes[0].path) // Thay thế trang hiện tại
    window.location.reload() // Tải lại trang
  }

  const handleItemClick = path => {
    setActiveItem(path)
    if (isMobile) {
      setIsActive(false)
    }
    localStorage.setItem('activeItem', path)
  }

  return (
    <div className={`navigation ${isActive ? 'active' : ''}`}>
      <ul>
        <li style={{ marginTop: 20 }}>
          <a href='#'>
            <span className='icon'>
              <img
                className='fonticon'
                style={{ width: 60, height: 60 }}
                src={require('../../../assets/images/LOGO.png')}
                alt='icon'
              />
            </span>
            <span
              className='title'
              style={{ fontSize: 30, fontWeight: 'bold' }}
            >
              BICRAFT
            </span>
          </a>
        </li>
        <li
          className={activeItem === '/home' ? 'hovered' : ''}
          onClick={() => handleItemClick('/home')}
        >
          <Link to={'/home'}>
            <a>
              <span className='icon'>
                <FontAwesomeIcon className='fonticon' icon={faHouse} />
              </span>
              <span className='title'>Tổng quan</span>
            </a>
          </Link>
        </li>
        <li
          className={activeItem === '/baocao' ? 'hovered' : ''}
          onClick={() => handleItemClick('/baocao')}
        >
          <Link to={'/baocao'}>
            <a>
              <span className='icon'>
                <FontAwesomeIcon className='fonticon' icon={faChartPie} />
              </span>
              <span className='title'>Báo cáo</span>
            </a>
          </Link>
        </li>
        <li
          className={activeItem === '/nhacungcap' ? 'hovered' : ''}
          onClick={() => handleItemClick('/nhacungcap')}
        >
          <Link to={'/nhacungcap'}>
            <a>
              <span className='icon'>
                <FontAwesomeIcon className='fonticon' icon={faHandshake} />
              </span>
              <span className='title'>Nhà cung cấp</span>
            </a>
          </Link>
        </li>

        <li
          className={activeItem === '/nhapkho' ? 'hovered' : ''}
          onClick={() => handleItemClick('/nhapkho')}
        >
          <Link to={'/nhapkho'}>
            <a>
              <span className='icon'>
                <FontAwesomeIcon className='fonticon' icon={faLandmark} />
              </span>
              <span className='title'>Nhập kho</span>
            </a>
          </Link>
        </li>

        <li
          className={activeItem === '/xuatkho' ? 'hovered' : ''}
          onClick={() => handleItemClick('/xuatkho')}
        >
          <Link to={'/xuatkho'}>
            <a>
              <span className='icon'>
                <FontAwesomeIcon className='fonticon' icon={faWarehouse} />
              </span>
              <span className='title'>Xuất kho</span>
            </a>
          </Link>
        </li>
        <li
          className={activeItem === '/trogiup' ? 'hovered' : ''}
          onClick={() => handleItemClick('/trogiup')}
        >
          <Link to={'/trogiup'}>
            <a>
              <span className='icon'>
                <FontAwesomeIcon className='fonticon' icon={faCircleQuestion} />
              </span>
              <span className='title'>Trợ giúp</span>
            </a>
          </Link>
        </li>
        <li className={activeItem === '/thietlap' ? 'hovered' : ''}>
          <a onClick={toggleDropdown}>
            <span className='icon'>
              <FontAwesomeIcon className='fonticon' icon={faGear} />
            </span>
            <span className='title'>Thiết lập</span>
            {/* Thêm mũi tên hiển thị dropdown */}
            <FontAwesomeIcon
              icon={isDropdownOpen ? faChevronUp : faChevronDown}
              className='dropdown-icon'
            />
          </a>
          {/* Dropdown menu */}
          {isDropdownOpen && (
            <ul className='dropdown-menu'>
              <li
                className={activeItem === '/thietlap/cauhinh' ? 'hovered' : ''}
                onClick={() => handleItemClick('/thietlap/cauhinh')}
              >
                <Link to={'/thietlap/cauhinh'}>
                  <a>
                    <span className='icon'>
                      <FontAwesomeIcon className='fonticon' icon={faWrench} />
                    </span>
                    <span className='title'>Cấu hình</span>
                  </a>
                </Link>
              </li>
              <li
                className={activeItem === '/thietlap/baomat' ? 'hovered' : ''}
                onClick={() => handleItemClick('/thietlap/baomat')}
              >
                <Link to={'/thietlap/baomat'}>
                  <a>
                    <span className='icon'>
                      <FontAwesomeIcon className='fonticon' icon={faShieldHalved} />
                    </span>
                    <span className='title'>Bảo mật</span>
                  </a>
                </Link>
              </li>
            </ul>
          )}
        </li>

        <li>
          <a onClick={handleLogout}>
            <span className='icon'>
              <FontAwesomeIcon className='fonticon' icon={faRightFromBracket} />
            </span>
            <span className='title'>Đăng Xuất</span>
          </a>
        </li>
      </ul>
    </div>
  )
}

export default Sidebar
