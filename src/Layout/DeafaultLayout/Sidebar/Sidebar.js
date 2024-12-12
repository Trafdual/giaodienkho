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
  faUserGroup,
  faFileInvoiceDollar,
  faMoneyBill,
  faMoneyCheck,
  faReceipt,
  faWallet,
  faCartShopping
} from '@fortawesome/free-solid-svg-icons'
import { publicRoutes } from '../../../router'
import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

function Sidebar ({ isActive, setIsActive }) {
  const location = useLocation()
  const [activeItem, setActiveItem] = useState('')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isDropdownOpenBaoCao, setIsDropdownOpenBaoCao] = useState(false)
  const [isDropdownOpenKho, setIsDropdownOpenKho] = useState(false)
  const [isDropdownOpenQuyTien, setIsDropdownOpenQuyTien] = useState(false)
  const khoID = localStorage.getItem('khoID')

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }
  const toggleDropdownBapCao = () => {
    setIsDropdownOpenBaoCao(!isDropdownOpenBaoCao)
  }
  const toggleDropdownKho = () => {
    setIsDropdownOpenKho(!isDropdownOpenKho)
  }
  const toggleDropdownQuyTien = () => {
    setIsDropdownOpenQuyTien(!isDropdownOpenQuyTien)
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
        <li
          className={`litong ${activeItem === '/home' ? 'hovered' : ''}`}
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
          className={`litong ${activeItem === '/khachhang' ? 'hovered' : ''}`}
          onClick={() => handleItemClick('/khachhang')}
        >
          <Link to={'/khachhang'}>
            <a>
              <span className='icon'>
                <FontAwesomeIcon className='fonticon' icon={faUserGroup} />
              </span>
              <span className='title'>Khách hàng</span>
            </a>
          </Link>
        </li>

        <li className={`litong1 ${activeItem === '/baocao' ? 'hovered' : ''}`}>
          <a onClick={toggleDropdownBapCao}>
            <span className='icon'>
              <FontAwesomeIcon className='fonticon' icon={faChartPie} />
            </span>
            <span className='title'>Báo cáo</span>
            <FontAwesomeIcon
              icon={isDropdownOpenBaoCao ? faChevronUp : faChevronDown}
              className='dropdown-icon'
            />
          </a>
          {isDropdownOpenBaoCao && (
            <ul className='dropdown-menu'>
              <li
                className={`litong ${
                  activeItem === '/doanhthu' ? 'hovered' : ''
                }`}
                onClick={() => handleItemClick('/doanhthu')}
              >
                <Link to={'/doanhthu'}>
                  <a>
                    <span className='icon'>
                      <FontAwesomeIcon className='fonticon' icon={faWrench} />
                    </span>
                    <span className='title'>Doanh Thu</span>
                  </a>
                </Link>
              </li>
              <li
                className={`litong ${
                  activeItem === '/baocaokho' ? 'hovered' : ''
                }`}
                onClick={() => handleItemClick('/baocaokho')}
              >
                <Link to={'/baocaokho'}>
                  <a>
                    <span className='icon'>
                      <FontAwesomeIcon
                        className='fonticon'
                        icon={faShieldHalved}
                      />
                    </span>
                    <span className='title'>Kho</span>
                  </a>
                </Link>
              </li>
              <li
                className={`litong ${
                  activeItem === '/baocaobanhang' ? 'hovered' : ''
                }`}
                onClick={() => handleItemClick('/baocaobanhang')}
              >
                <Link to={'/baocaobanhang'}>
                  <a>
                    <span className='icon'>
                      <FontAwesomeIcon
                        className='fonticon'
                        icon={faCartShopping}
                      />
                    </span>
                    <span className='title'>Bán hàng</span>
                  </a>
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li
          className={`litong ${activeItem === '/nhacungcap' ? 'hovered' : ''}`}
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

        <li className='litong1'>
          <a onClick={toggleDropdownKho}>
            <span className='icon'>
              <FontAwesomeIcon className='fonticon' icon={faLandmark} />
            </span>
            <span className='title'>Kho</span>
            <FontAwesomeIcon
              icon={isDropdownOpenKho ? faChevronUp : faChevronDown}
              className='dropdown-icon'
            />
          </a>
          {isDropdownOpenKho && (
            <ul className='dropdown-menu'>
              <li
                className={`litong ${
                  activeItem === '/nhapkho' ? 'hovered' : ''
                }`}
                onClick={() => handleItemClick('/nhapkho')}
              >
                <Link to={'/nhapkho'}>
                  <a>
                    <span className='icon'>
                      <FontAwesomeIcon className='fonticon' icon={faLandmark} />
                    </span>
                    <span className='title'>Nhập Kho</span>
                  </a>
                </Link>
              </li>
              <li
                className={`litong ${
                  activeItem === '/xuatkho' ? 'hovered' : ''
                }`}
                onClick={() => handleItemClick('/xuatkho')}
              >
                <Link to={'/xuatkho'}>
                  <a>
                    <span className='icon'>
                      <FontAwesomeIcon
                        className='fonticon'
                        icon={faWarehouse}
                      />
                    </span>
                    <span className='title'>Xuất Kho</span>
                  </a>
                </Link>
              </li>
              <li
                className={`litong ${
                  activeItem === '/dieuchuyen' ? 'hovered' : ''
                }`}
                onClick={() => handleItemClick('/dieuchuyen')}
              >
                <Link to={'/dieuchuyen'}>
                  <a>
                    <span className='icon'>
                      <FontAwesomeIcon
                        className='fonticon'
                        icon={faTruckFast}
                      />
                    </span>
                    <span className='title'>Điều chuyển từ cửa hàng khác</span>
                  </a>
                </Link>
              </li>
              <li
                className={`litong ${
                  activeItem === '/lenhdieuchuyen' ? 'hovered' : ''
                }`}
                onClick={() => handleItemClick('/lenhdieuchuyen')}
              >
                <Link to={'/lenhdieuchuyen'}>
                  <a>
                    <span className='icon'>
                      <FontAwesomeIcon
                        className='fonticon'
                        icon={faTruckFast}
                      />
                    </span>
                    <span className='title'>Lệnh điều chuyển</span>
                  </a>
                </Link>
              </li>
            </ul>
          )}
        </li>

        <li className='litong1'>
          <a onClick={toggleDropdownQuyTien}>
            <span className='icon'>
              <FontAwesomeIcon className='fonticon' icon={faWallet} />
            </span>
            <span className='title'>Quỹ tiền</span>
            <FontAwesomeIcon
              icon={isDropdownOpenQuyTien ? faChevronUp : faChevronDown}
              className='dropdown-icon'
            />
          </a>
          {isDropdownOpenQuyTien && (
            <ul className='dropdown-menu'>
              <li
                className={`litong ${
                  activeItem === '/quytienmat' ? 'hovered' : ''
                }`}
                onClick={() => handleItemClick('/quytienmat')}
              >
                <Link to={'/quytienmat'}>
                  <a>
                    <span className='icon'>
                      <FontAwesomeIcon
                        className='fonticon'
                        icon={faMoneyBill}
                      />
                    </span>
                    <span className='title'>Thu, chi tiền mặt</span>
                  </a>
                </Link>
              </li>
              <li
                className={`litong ${
                  activeItem === '/xuatkho' ? 'hovered' : ''
                }`}
                onClick={() => handleItemClick('/xuatkho')}
              >
                <Link to={'/xuatkho'}>
                  <a>
                    <span className='icon'>
                      <FontAwesomeIcon className='fonticon' icon={faReceipt} />
                    </span>
                    <span className='title'>Sổ chi tiết tiền mặt</span>
                  </a>
                </Link>
              </li>
              <li
                className={`litong ${
                  activeItem === '/dieuchuyen' ? 'hovered' : ''
                }`}
                onClick={() => handleItemClick('/dieuchuyen')}
              >
                <Link to={'/quytiengui'}>
                  <a>
                    <span className='icon'>
                      <FontAwesomeIcon
                        className='fonticon'
                        icon={faMoneyCheck}
                      />
                    </span>
                    <span className='title'>Thu, chi tiền gửi</span>
                  </a>
                </Link>
              </li>
              <li
                className={`litong ${
                  activeItem === '/lenhdieuchuyen' ? 'hovered' : ''
                }`}
                onClick={() => handleItemClick('/lenhdieuchuyen')}
              >
                <Link to={'/lenhdieuchuyen'}>
                  <a>
                    <span className='icon'>
                      <FontAwesomeIcon className='fonticon' icon={faReceipt} />
                    </span>
                    <span className='title'>Sổ chi tiết tiền gửi</span>
                  </a>
                </Link>
              </li>
            </ul>
          )}
        </li>

        <li
          className={`litong ${activeItem === '/hoadon' ? 'hovered' : ''}`}
          onClick={() => handleItemClick('/hoadon')}
        >
          <Link to={'/hoadon'}>
            <a>
              <span className='icon'>
                <FontAwesomeIcon
                  className='fonticon'
                  icon={faFileInvoiceDollar}
                />
              </span>
              <span className='title'>Hóa Đơn</span>
            </a>
          </Link>
        </li>
        <li
          className={`litong ${activeItem === '/banhang' ? 'hovered' : ''}`}
          onClick={() => {
            localStorage.setItem('khoIDBH', khoID)
            handleItemClick('/banhang')
          }}
        >
          <a href='/banhang' target='_blank' rel='noopener noreferrer'>
            <span className='icon'>
              <FontAwesomeIcon className='fonticon' icon={faCartShopping} />
            </span>
            <span className='title'>Bán Hàng</span>
          </a>
        </li>

        <li
          className={`litong ${activeItem === '/trogiup' ? 'hovered' : ''}`}
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
          className={`litong ${
            activeItem === '/testlungtung' ? 'hovered' : ''
          }`}
          onClick={() => handleItemClick('/testlungtung')}
        >
          <Link to={'/testlungtung'}>
            <a>
              <span className='icon'>
                <FontAwesomeIcon className='fonticon' icon={faCircleQuestion} />
              </span>
              <span className='title'>Test Lung Tung</span>
            </a>
          </Link>
        </li>
        <li
          className={`litong1 ${activeItem === '/thietlap' ? 'hovered' : ''}`}
        >
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
                className={`litong ${
                  activeItem === '/thietlap' ? 'hovered' : ''
                }`}
                onClick={() => handleItemClick('/thietlap')}
              >
                <Link to={'/thietlap'}>
                  <a>
                    <span className='icon'>
                      <FontAwesomeIcon className='fonticon' icon={faWrench} />
                    </span>
                    <span className='title'>Cấu hình</span>
                  </a>
                </Link>
              </li>
              <li
                className={`litong ${
                  activeItem === '/thietlap/baomat' ? 'hovered' : ''
                }`}
                onClick={() => handleItemClick('/thietlap/baomat')}
              >
                <Link to={'/thietlap/baomat'}>
                  <a>
                    <span className='icon'>
                      <FontAwesomeIcon
                        className='fonticon'
                        icon={faShieldHalved}
                      />
                    </span>
                    <span className='title'>Bảo mật</span>
                  </a>
                </Link>
              </li>
            </ul>
          )}
        </li>

        <li className='litong'>
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
