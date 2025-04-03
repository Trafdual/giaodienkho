/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCaretDown,
  faBell,
  faCircleQuestion
} from '@fortawesome/free-solid-svg-icons'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'
import './HeaderBanHang.scss'
import axios from 'axios'
import NotificationsList from '~/components/Notifications/Notification'
import { useNavigate } from 'react-router-dom'
import { faFacebookMessenger } from '@fortawesome/free-brands-svg-icons'
import { getApiUrl } from '../../../api/api'
import { getFromLocalStorage } from '../../../components/MaHoaLocalStorage/MaHoaLocalStorage'
import { ListKho } from '../../DeafaultLayout/Header/ListKho'
import { Modal } from '../../../components/Modal'
import { useToast } from '../../../components/GlobalStyles/ToastContext'

function HeaderBanHang ({ userId, username }) {
  const { showToast } = useToast()
  const [khoList, setKhoList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDropdownVisible, setDropdownVisible] = useState(false)
  const [selectedKho, setSelectedKho] = useState(null)
  const dropdownRef = useRef(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const [datakho, setdatakho] = useState([])
  const [loading, setloading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(!selectedKho)
  const userID = getFromLocalStorage('userId')
  const khoId = localStorage.getItem('khoID')

  const handleGetKho = async () => {
    try {
      const response = await fetch(
        `${getApiUrl('domain')}/getdepot/${userID}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        setdatakho(data)
        setloading(false)

        const storedKhoID = localStorage.getItem('khoID')
        if (storedKhoID) {
          const storedKho = data.find(kho => kho._id === storedKhoID)
          if (storedKho) {
            setSelectedKho(storedKho)
          }
        }
      } else {
        console.error('Failed to fetch data')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    handleGetKho()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userID])

  const userdata = getFromLocalStorage('data')
  const navigate = useNavigate()

  const [isMenuVisible, setMenuVisible] = useState(false)

  const toggleMenu = () => {
    setMenuVisible(prev => !prev)
  }

  const handleLogout = () => {
    localStorage.clear()
    sessionStorage.clear()
    window.location.href = '/'
  }

  const handleClickOutsideMenu = event => {
    if (
      !event.target.closest('.menu-container') &&
      !event.target.closest('.imgmenu')
    ) {
      setMenuVisible(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsideMenu)
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideMenu)
    }
  }, [])

  useEffect(() => {
    if (!userId) return

    const fetchKhoData = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get(
          `${getApiUrl('domain')}/getdepot/${userId}`
        )
        if (Array.isArray(response.data)) {
          setKhoList(response.data)
        } else {
          console.error('Unexpected API response:', response.data)
          setKhoList([])
        }
      } catch (error) {
        console.error('Error fetching kho data:', error)
        setKhoList([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchKhoData()
  }, [userId])

  const toggleDropdown = () => {
    setDropdownVisible(prev => !prev)
  }

  const handelchuyenman = man => {
    window.location.assign(man)
  }

  const handleSelectKho = kho => {
    setSelectedKho(kho)
    setDropdownVisible(false)
    localStorage.setItem('khoIDBH', kho._id)
    localStorage.setItem('khoID', kho._id)

    window.location.reload()
  }
  useEffect(() => {
    const storedKhoID = localStorage.getItem('khoIDBH')
    if (storedKhoID && khoList.length > 0) {
      const storedKho = khoList.find(kho => kho._id === storedKhoID)
      if (storedKho) {
        setSelectedKho(storedKho)
      }
    }
  }, [khoList])

  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className='topbar1'>
      <div className='logo'>
        <img src='/LOGO.png' alt='Logo' />
        <h3>BiCraft</h3>
      </div>

      <div className='user1'>
        <div className='dropdown1'>
          <button className='dropdown-button' onClick={toggleDropdown}>
            {selectedKho ? selectedKho.name : 'Chọn kho'}
            <FontAwesomeIcon icon={faCaretDown} />
          </button>
          {isDropdownVisible && (
            <ul className='dropdown-list' ref={dropdownRef}>
              {khoList?.map(kho => (
                <li key={kho._id} onClick={() => handleSelectKho(kho)}>
                  {kho.name} - {kho.address}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className='help'>
          <Tippy content='Tin nhắn' placement='bottom'>
            <button className='btn-icon'>
              <FontAwesomeIcon
                className='icon-help'
                icon={faFacebookMessenger}
              />
            </button>
          </Tippy>
          <Tippy
            interactive={true}
            visible={showNotifications}
            placement='bottom'
            render={() => <></>}
          >
            <button
              className='btn-icon'
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <FontAwesomeIcon className='icon-help' icon={faBell} />
            </button>
          </Tippy>
          {showNotifications && <NotificationsList />}

          <Tippy content='Trợ giúp' placement='bottom'>
            <button
              className='btn-icon'
              onClick={() => navigate('/trogiuptongquan')}
            >
              <FontAwesomeIcon className='icon-help' icon={faCircleQuestion} />
            </button>
          </Tippy>
        </div>
        <div className='user-info'>
          <img
            src='https://gcs.tripi.vn/public-tripi/tripi-feed/img/474014bom/anh-gai-xinh-cute-de-thuong-hot-girl-2.jpg'
            alt=''
          />
          <h4>{username}</h4>
        </div>
        <div>
          <img src='menu.png' alt='' className='imgmenu' onClick={toggleMenu} />
        </div>
        {isMenuVisible && (
          <div className='menu-container'>
            <div className='menu1'>
              <div
                className='menu-item'
                onClick={() => handelchuyenman('/banhang')}
              >
                <i className='ibanhang'></i>
                <span>Bán hàng</span>
              </div>
              <div className='menu-item'>
                <i className='idonhang'></i>
                <span>Đơn hàng</span>
              </div>
              <div
                className='menu-item'
                onClick={() => handelchuyenman('/danhsachhoadon')}
              >
                <i className='ihoadon'></i>
                <span>DS hóa đơn</span>
              </div>
              {/* dòng 2 */}
              <div
                className='menu-item'
                onClick={() => handelchuyenman('/thuno')}
              >
                <i className='ithuchi'></i>
                <span>Thu chi</span>
              </div>
              {userdata.data.user[0].role === 'manager' ||
                (userdata.data.user[0].role === 'staff' &&
                  (userdata.data.user[0].quyen.includes('ketoan') ||
                    userdata.data.user[0].quyen.includes('quanly')) && (
                    <div
                      className='menu-item'
                      onClick={() => handelchuyenman('/')}
                    >
                      <i className='itrangquanly'></i>
                      <span>Trang quản lý</span>
                    </div>
                  ))}
              <div
                className='menu-item'
                onClick={() => navigate('/danhsachhoadon')}
              >
                <i className='ithietlap'></i>
                <span>Thiết lập hiển thị</span>
              </div>
              {/* dòng 3 */}
              <div className='menu-item'>
                <i className='ihuongdan'></i>
                <span>Hướng dẫn</span>
              </div>
              <div className='menu-item'>
                <i className='igopy'></i>
                <span>Góp ý cải tiến</span>
              </div>
              <div
                className='menu-item'
                onClick={() => navigate('/danhsachhoadon')}
              >
                <i className='igioithieu'></i>
                <span>Giới thiệu</span>
              </div>
              <div className='menu-item' onClick={handleLogout}>
                <i className='idangxuat'></i>
                <span>Đăng xuất</span>
              </div>
            </div>
          </div>
        )}
      </div>
      {!khoId && (
        <Modal
          isOpen={isModalOpen}
          title='Vui lòng chọn kho'
          onClose={() =>
            showToast('Vui lòng chọn kho trước khi sử dụng!', 'warning')
          }
        >
          <p>Trước khi sử dụng các chức năng, bạn cần chọn một kho:</p>
          <div
            className='landauvaoapp'
            style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}
          >
            <ListKho
              datakho={datakho}
              setdatakho={setdatakho}
              setloading={setloading}
              selectedKho={selectedKho}
              setSelectedKho={setSelectedKho}
            />
          </div>
        </Modal>
      )}

      {isLoading && <div className='loading-overlay'>Loading...</div>}
    </div>
  )
}

export default HeaderBanHang
