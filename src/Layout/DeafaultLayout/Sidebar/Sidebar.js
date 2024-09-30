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
  faPhone,
  faEnvelope,
  faLandmark,
  faRightFromBracket,
  faWarehouse
} from '@fortawesome/free-solid-svg-icons'
import { publicRoutes } from '../../../router'
import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

function Sidebar({ isActive, setIsActive }) {
  const location = useLocation()
  const [activeItem, setActiveItem] = useState('')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [isDropdownOpen, setIsDropdownOpen] = useState(null);

  const toggleDropdown = (index) => {
    setIsDropdownOpen(isDropdownOpen === index ? null : index);
  };


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
              className={activeItem === '/category' ? 'hovered' : ''}
              onClick={() => toggleDropdown(0)}
            >
              <Link to={'#'}>
                <span className="icon">
                  <FontAwesomeIcon className="fonticon" icon={faCircleQuestion} />
                </span>
                <span className="title">Category</span>
              </Link>

              {isDropdownOpen === 0 && (
                <ul className="submenu open">
                  <li onClick={() => handleItemClick('/category/html-css')}>
                    <Link to="/nhapkho">HTML & CSS</Link>
                  </li>
                  <li onClick={() => handleItemClick('/category/javascript')}>
                    <Link to="/nhapkho">JavaScript</Link>
                  </li>
                  <li onClick={() => handleItemClick('/category/php-mysql')}>
                    <Link to="/nhapkho">PHP & MySQL</Link>
                  </li>
                </ul>
              )}
            </li>


        <li
          className={activeItem === '/thietlap' ? 'hovered' : ''}
          onClick={() => handleItemClick('/thietlap')}
        >
          <Link to={'/thietlap'}>
            <a>
              <span className='icon'>
                <FontAwesomeIcon className='fonticon' icon={faGear} />
              </span>
              <span className='title'>Thiết lập</span>
            </a>
          </Link>
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
