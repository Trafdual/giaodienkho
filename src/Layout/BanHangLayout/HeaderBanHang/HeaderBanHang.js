import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSearch,
  faCaretDown,
  faMessage,
  faBell,
  faQuestion
} from '@fortawesome/free-solid-svg-icons'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'
import './HeaderBanHang.scss'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function HeaderBanHang ({ userId }) {
  const [khoList, setKhoList] = useState([]) // Đảm bảo giá trị mặc định là []
  const [keyword, setKeyword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isDropdownVisible, setDropdownVisible] = useState(false)
  const [selectedKho, setSelectedKho] = useState(null)
  const dropdownRef = useRef(null)
  const khoID = localStorage.getItem('khoID')

  const navigate = useNavigate()

  useEffect(() => {
    if (khoID) {
      const khoIDBH = localStorage.getItem('khoIDBH')
      if (!khoIDBH) {
        localStorage.setItem('khoIDBH', khoID)
      }
    }
  }, [khoID])

useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      console.log('Tab bị ẩn, không xóa khoIDBH.')
    }
  }

  const clearKhoIDBH = () => {
    const isHidden = document.visibilityState === 'hidden'
    if (!isHidden) {
      localStorage.setItem('khoIDBH', '') // Chỉ xóa khi tab bị tắt hẳn
    }
  }

  document.addEventListener('visibilitychange', handleVisibilityChange)
  window.addEventListener('beforeunload', clearKhoIDBH)

  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    window.removeEventListener('beforeunload', clearKhoIDBH)
  }
}, [])


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
  const handleSearch = () => {
    if (keyword.trim()) {
      navigate(`/search-products?keyword=${keyword}`)
    }
  }

  const handleKeyDown = event => {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }

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
        <img src='/path-to-logo.png' alt='Logo' />
      </div>

      <div className='search'>
        <input
          type='text'
          placeholder='Tìm kiếm sản phẩm...'
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <FontAwesomeIcon
          className='icon-search'
          icon={faSearch}
          onClick={handleSearch}
        />
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
            <button className='btn-icon'>
              <FontAwesomeIcon className='icon-help' icon={faBell} />
            </button>
          </Tippy>
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
