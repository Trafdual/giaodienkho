/* eslint-disable jsx-a11y/anchor-is-valid */

import './Sidebar.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBuildingColumns,
  faChartPie,
  faCircleQuestion,
  faGear,
  faHouse,
  faRightFromBracket,
  faWarehouse
} from '@fortawesome/free-solid-svg-icons'
import { faApple } from '@fortawesome/free-brands-svg-icons'
import { publicRoutes } from '../../../router'

function Sidebar ({ isActive }) {
  const handleLogout = () => {
    localStorage.clear()

    sessionStorage.clear()

    window.location.replace(publicRoutes[0].path)
  }

  return (
    <div className={`navigation ${isActive ? 'active' : ''}`}>
      <ul>
        <li>
          <a href='#'>
            <span className='icon'>
              <FontAwesomeIcon
                className='fonticon'
                style={{ fontSize: 30 }}
                icon={faApple}
              />
            </span>
            <span className='title' style={{ fontSize: 30, fontWeight: 500 }}>
              Brand Name
            </span>
          </a>
        </li>
        <li className='hovered'>
          <a href='#'>
            <span className='icon'>
              <FontAwesomeIcon className='fonticon' icon={faHouse} />
            </span>
            <span className='title'>Tổng quan</span>
          </a>
        </li>
        <li>
          <a href='#'>
            <span className='icon'>
              <FontAwesomeIcon className='fonticon' icon={faChartPie} />
            </span>
            <span className='title'>Báo cáo</span>
          </a>
        </li>
        <li>
          <a href='#'>
            <span className='icon'>
              <FontAwesomeIcon className='fonticon' icon={faBuildingColumns} />
            </span>
            <span className='title'>Nhập kho</span>
          </a>
        </li>
        <li>
          <a href='#'>
            <span className='icon'>
              <FontAwesomeIcon className='fonticon' icon={faWarehouse} />
            </span>
            <span className='title'>Xuất kho</span>
          </a>
        </li>
        <li>
          <a href='#'>
            <span className='icon'>
              <FontAwesomeIcon className='fonticon' icon={faCircleQuestion} />
            </span>
            <span className='title'>Trợ giúp</span>
          </a>
        </li>
        <li>
          <a href='#'>
            <span className='icon'>
              <FontAwesomeIcon className='fonticon' icon={faGear} />
            </span>
            <span className='title'>Thiết lập</span>
          </a>
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
