import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCaretDown,
  faMessage,
  faBell,
  faQuestion
} from '@fortawesome/free-solid-svg-icons'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'
import './HeaderBanHang.scss'
import axios from 'axios'
import NotificationsList from "~/components/Notifications/Notification";

function HeaderBanHang ({ userId }) {
  const [khoList, setKhoList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDropdownVisible, setDropdownVisible] = useState(false)
  const [selectedKho, setSelectedKho] = useState(null)
  const dropdownRef = useRef(null)
  const [showNotifications, setShowNotifications] = useState(false);


  useEffect(() => {
    if (!userId) return

    const fetchKhoData = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get(
          `https://www.ansuataohanoi.com/getdepot/${userId}`
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

  const handleSelectKho = kho => {
    setSelectedKho(kho)
    setDropdownVisible(false)
    localStorage.setItem('khoIDBH', kho._id)
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
      <div className='dropdown'>
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

      <div className='user'>
        <div className='user-info'>
          <img
            src='https://gcs.tripi.vn/public-tripi/tripi-feed/img/474014bom/anh-gai-xinh-cute-de-thuong-hot-girl-2.jpg'
            alt=''
          />
          <h4>{userId}</h4>
        </div>
        <div className='help'>
          <Tippy content='Tin nhắn' placement='bottom'>
            <button className='btn-icon'>
              <FontAwesomeIcon className='icon-help' icon={faMessage} />
            </button>
          </Tippy>
          <Tippy content='Thông báo' placement='bottom'>
            <button className='btn-icon' onClick={() => setShowNotifications(!showNotifications)}>
              <FontAwesomeIcon className='icon-help' icon={faBell} />
            </button>
          </Tippy>
          {showNotifications && <NotificationsList />}

          <Tippy content='Trợ giúp' placement='bottom'>
            <button className='btn-icon'>
              <FontAwesomeIcon className='icon-help' icon={faQuestion} />
            </button>
          </Tippy>
        </div>
      </div>

      {isLoading && <div className='loading-overlay'>Loading...</div>}
    </div>
  )
}

export default HeaderBanHang
