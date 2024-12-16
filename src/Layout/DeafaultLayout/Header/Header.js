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
import { Link, useNavigate } from 'react-router-dom'
import { Loading } from '~/components/Loading'
import NotificationsList from "~/components/Notifications/Notification";
import { Modal } from '~/components/Modal'
function Header({
  toggleMenu,
  userId,
  name,
  isActive,
  setloading,
  datakho,
  setdatakho,
  selectedKho,
  setSelectedKho
}) {
  const { showToast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [isDropdownVisible, setDropdownVisible] = useState(false)
  const [filterOptions] = useState([
    'theo tên máy',
    '3 số đầu imel',
    '3 số cuối imel'
  ])
  const [filterOption, setFilterOption] = useState('theo tên máy')
  const [keyword, setKeyword] = useState('')
  const [khoID, setKhoID] = useState(localStorage.getItem('khoID') || '')
  const [isLoading, setIsLoading] = useState(false) // Trạng thái loading
  const previousKhoID = useRef(khoID)
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  useEffect(() => {
    // Mở modal nếu chưa chọn kho
    if (!selectedKho) {
      setIsModalOpen(true)
    }
  }, [selectedKho])
  const handleKhoChange = (kho) => {
    setSelectedKho(kho)
    localStorage.setItem('khoID', kho._id)
    setIsModalOpen(false)
  }
  useEffect(() => {
    const intervalId = setInterval(() => {
      const newKhoID = localStorage.getItem('khoID') || ''
      if (newKhoID !== khoID) {
        console.log('Interval detected change, updating khoID:', newKhoID)
        setKhoID(newKhoID)
      }
    }, 1000)

    return () => clearInterval(intervalId)
  }, [khoID])

  const dropdownRef = useRef(null)

  const handleCloseModal = () => {
    setIsOpen(false)
  }
  const handleCloseModalKho = () => {
    showToast('Vui lòng chọn kho trước khi sử dụng!', 'warning');
  }

  const toggleDropdown = () => {
    setDropdownVisible(prev => !prev)
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
  }, [dropdownRef])

  const handleSetFilterOption = option => {
    setFilterOption(option)
    setDropdownVisible(false)
  }

  useEffect(() => {
    const newKhoID = localStorage.getItem('khoID') || ''

    if (newKhoID !== khoID) {
      console.log('Kho ID đã thay đổi:', newKhoID)
      setKhoID(newKhoID)
      setKeyword('')
    }
  }, [khoID])

  const getPlaceholder = () => {
    switch (filterOption) {
      case 'theo tên máy':
        return 'Nhập tên sản phẩm...'
      case '3 số đầu imel':
        return 'Nhập 3 số đầu imel...'
      case '3 số cuối imel':
        return 'Nhập 3 số cuối imel...'
      default:
        return 'Tìm kiếm...'
    }
  }

  const searchProduct = async () => {
    if (!selectedKho) {
      showToast('Vui lòng chọn kho trước khi tìm kiếm!', 'warning');
      return;
    }
    setIsLoading(true);
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
            keyword: keyword
          })
        }
      )
      const data = await response.json()

      if (response.ok) {
        const dataToSend = previousKhoID.current !== khoID ? [] : data
        navigate('/search-products', { state: { products: dataToSend } })
      } else {
        showToast('Không tìm thấy sản phẩm', 'error')
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu tìm sản phẩm:', error)
      showToast('Tìm sản phẩm thất bại', 'error')
    } finally {
      setIsLoading(false) // Kết thúc loading
    }
  }

  const handleKeyDown = event => {
    if (event.key === 'Enter') {
      searchProduct()
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
            onKeyDown={handleKeyDown} // Thực hiện tìm kiếm khi nhấn Enter
            value={keyword}
            disabled={isLoading} // Vô hiệu hóa ô nhập khi đang loading
          />
          <FontAwesomeIcon
            className='iconsearch'
            icon={faFilter}
            onClick={toggleDropdown}
          />
          <button
            className='search-button'
            onClick={searchProduct}
            disabled={isLoading} // Vô hiệu hóa nút khi đang loading
          >
            {isLoading ? 'Đang tìm kiếm...' : 'Tìm kiếm'}
          </button>
        </label>

        {isDropdownVisible && (
          <ul className='filter-dropdown' ref={dropdownRef}>
            {filterOptions.map((option, index) => (
              <li key={index} onClick={() => handleSetFilterOption(option)}>
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
        <ListKho
          datakho={datakho}
          setdatakho={setdatakho}
          setloading={setloading}
          selectedKho={selectedKho}
          setSelectedKho={setSelectedKho}
        />
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
            <button className='btnicon' onClick={() => setShowNotifications(!showNotifications)}>
              <FontAwesomeIcon className='iconhelp' icon={faBell} />
            </button>
          </Tippy>
          {showNotifications && <NotificationsList />}
          <Tippy content='Trợ giúp' placement='bottom'>
            <button className='btnicon' onClick={() => {
              navigate('/trogiuptongquan');
            }}>
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
      {isModalOpen && (
        <Modal isOpen={isModalOpen} title="Vui lòng chọn kho" onClose={handleCloseModalKho}>
          <p>Trước khi sử dụng các chức năng, bạn cần chọn một kho:</p>
          <div className='landauvaoapp' style={{ display: 'flex',alignItems:'center', margin: '20px 0'}}>
            <ListKho
              datakho={datakho}
              setdatakho={setdatakho}
              setloading={setloading}
              selectedKho={selectedKho}
              setSelectedKho={setSelectedKho}
            />
            <div className='divthemkho' style={{width:'50px',height:'50px'}}>
              <Tippy content='Thêm kho' placement='bottom'>
                <button className='btnicon' onClick={() => setIsOpen(true)}>
                  Thêm kho
                </button>
              </Tippy>
            </div>
          </div>
        </Modal>
      )}


      {isLoading && <Loading />}
    </div>
  )
}

export default Header
