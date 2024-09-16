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
  faWarehouse
} from '@fortawesome/free-solid-svg-icons'
import { publicRoutes } from '../../../router'
import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

function Sidebar ({ isActive, setIsActive }) {
  const location = useLocation()
  const [activeItem, setActiveItem] = useState('')

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

  const handleLogout = () => {
    localStorage.clear()
    sessionStorage.clear()
    window.location.replace(publicRoutes[0].path)
  }

  const handleItemClick = path => {
    setActiveItem(path)
    setIsActive(true)
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
