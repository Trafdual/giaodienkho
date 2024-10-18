import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBars,
  faBell,
  faCircleQuestion,
  faFilter,
  faPlus
} from '@fortawesome/free-solid-svg-icons'
import { faFacebookMessenger } from '@fortawesome/free-brands-svg-icons'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'
import './Header.scss'
import { ListKho } from './ListKho'
import { AddKho } from './AddKho'
import { useToast } from '../../../components/GlobalStyles/ToastContext'
import { useNavigate } from 'react-router-dom'

function Header ({ toggleMenu, userId, name, isActive }) {
  const [datakho, setdatakho] = useState([])
  const { showToast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [isDropdownVisible, setDropdownVisible] = useState(false) // Trạng thái hiển thị dropdown
  const [filterOptions] = useState([
    'theo tên máy',
    '3 số đầu imel',
    '3 số cuối imel'
  ]) // Tùy chọn filter
  const [filterOption, setFilterOption] = useState('theo tên máy') // Tùy chọn filter hiện tại
  const [keywword, setKeyword] = useState('')
  const [khoID, setKhoID] = useState(localStorage.getItem('khoID') || '')
  const navigate = useNavigate()

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newKhoID = localStorage.getItem('khoID') || ''
      if (newKhoID !== khoID) {
        console.log('Interval detected change, updating khoID:', newKhoID)
        setKhoID(newKhoID)
      }
    }, 1000) // Kiểm tra mỗi giây

    return () => clearInterval(intervalId)
  }, [khoID])

  // useRef để lấy tham chiếu đến dropdown menu
  const dropdownRef = useRef(null)

  const handleCloseModal = () => {
    setIsOpen(false)
  }

  const toggleDropdown = () => {
    setDropdownVisible(prev => !prev) // Bật/tắt dropdown
  }

  // useEffect để xử lý khi bấm ra ngoài sẽ đóng dropdown
  useEffect(() => {
    const handleClickOutside = event => {
      // Nếu click bên ngoài dropdownRef thì ẩn dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false)
      }
    }

    // Thêm sự kiện 'mousedown' vào document
    document.addEventListener('mousedown', handleClickOutside)

    // Cleanup sự kiện khi component bị unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownRef])
  const handleSetfilerOption = option => {
    setFilterOption(option)
    setDropdownVisible(false)
  }
  const getPlaceholder = () => {
    if (filterOption === 'theo tên máy') {
      return 'Nhập tên sản phẩm...'
    } else if (filterOption === '3 số đầu imel') {
      return 'Nhập 3 số đầu imel...'
    } else if (filterOption === '3 số cuối imel') {
      return 'Nhập 3 số cuối imel...'
    }
    return 'Search...'
  }
  const searchproduct = async () => {
    try {
      const response = await fetch(
        `https://www.ansuataohanoi.com/searchsanpham/${khoID}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            searchType: filterOption,
            keyword: keywword
          })
        }
      )
      const data = await response.json()

      if (response.ok) {
        navigate('/search-products', { state: { products: data } })
        setKeyword('')
      } else {
        showToast('không tìm thấy sản phẩm', 'error')
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu tìm sản phẩm:', error)
      showToast('Tìm sản phẩm thất bại', 'error')
    }
  }

  return (
    <div className={`topbar ${isActive ? 'active' : ''}`}>
      <div className='toggle' onClick={toggleMenu}>
        <FontAwesomeIcon style={{ fontSize: 20 }} icon={faBars} />
      </div>
      <div className='search'>
        <label>
          <input
            type='text'
            placeholder={getPlaceholder()}
            onChange={e => setKeyword(e.target.value)}
            value={keywword}
          />
          <FontAwesomeIcon
            className='iconsearch'
            icon={faFilter}
            onClick={toggleDropdown} // Khi bấm vào thì dropdown hiển thị
          />
          <button className='search-button' onClick={searchproduct}>
            Search
          </button>
        </label>

        {isDropdownVisible && (
          <ul className='filter-dropdown' ref={dropdownRef}>
            {filterOptions.map((option, index) => (
              <li key={index} onClick={() => handleSetfilerOption(option)}>
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className='user'>
        <div className='divthemkho'>
          <Tippy content='Thêm kho' placement='bottom'>
            <button className='btnicon' onClick={() => setIsOpen(true)}>
              <FontAwesomeIcon className='iconhelp' icon={faPlus} />
            </button>
          </Tippy>
        </div>
        <ListKho datakho={datakho} setdatakho={setdatakho} />
        <div className='optiontk'>
          <img
            src='https://gcs.tripi.vn/public-tripi/tripi-feed/img/474014bom/anh-gai-xinh-cute-de-thuong-hot-girl-2.jpg'
            alt=''
          />
          <h4>{name}</h4>
        </div>
        <div className='help'>
          <Tippy content='Tin nhắn' placement='bottom'>
            <button className='btnicon'>
              <FontAwesomeIcon
                className='iconhelp'
                icon={faFacebookMessenger}
              />
            </button>
          </Tippy>

          <Tippy content='Thông báo' placement='bottom'>
            <button className='btnicon'>
              <FontAwesomeIcon className='iconhelp' icon={faBell} />
            </button>
          </Tippy>

          <Tippy content='Trợ giúp' placement='bottom'>
            <button className='btnicon'>
              <FontAwesomeIcon className='iconhelp' icon={faCircleQuestion} />
            </button>
          </Tippy>
        </div>
      </div>
      <AddKho
        onClose={handleCloseModal}
        isOpen={isOpen}
        userId={userId}
        setdatakho={setdatakho}
      />
    </div>
  )
}

export default Header
