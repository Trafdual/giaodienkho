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
import { Loading } from '~/components/Loading'
import NotificationsList from '~/components/Notifications/Notification'
import { Modal } from '~/components/Modal'
import { getFromLocalStorage } from '../../../components/MaHoaLocalStorage/MaHoaLocalStorage'
import { getApiUrl } from '../../../api/api'

function Header ({
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
  const [filterOption, setFilterOption] = useState('theo tên máy')
  const [keyword, setKeyword] = useState('')
  const [khoID, setKhoID] = useState(localStorage.getItem('khoID') || '')
  const [isLoading, setIsLoading] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(!selectedKho)
  const navigate = useNavigate()
  const dropdownRef = useRef(null)
  const userdata = getFromLocalStorage('data')

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newKhoID = localStorage.getItem('khoID') || ''
      if (newKhoID !== khoID) setKhoID(newKhoID)
    }, 1000)
    return () => clearInterval(intervalId)
  }, [khoID])

  useEffect(() => {
    const handleClickOutside = e =>
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target) &&
      setDropdownVisible(false)
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getPlaceholder = () =>
    ({
      'theo tên máy': 'Nhập tên sản phẩm...',
      '3 số đầu imel': 'Nhập 3 số đầu imel...',
      '3 số cuối imel': 'Nhập 3 số cuối imel...'
    }[filterOption] || 'Tìm kiếm...')

  const searchProduct = async () => {
    if (!selectedKho)
      return showToast('Vui lòng chọn kho trước khi tìm kiếm!', 'warning')
    setIsLoading(true)
    try {
      const res = await fetch(`${getApiUrl('domain')}/searchsanpham/${khoID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ searchType: filterOption, keyword })
      })
      const data = await res.json()
      res.ok
        ? navigate('/search-products', { state: { products: data } })
        : showToast('Không tìm thấy sản phẩm', 'error')
    } catch (error) {
      showToast('Tìm sản phẩm thất bại', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`topbar ${isActive ? 'active' : ''}`}>
      <div className='toggle' onClick={toggleMenu}>
        <FontAwesomeIcon icon={faBars} style={{ fontSize: 20 }} />
      </div>
      <div className='search'>
        <label>
          <input
            type='text'
            placeholder={getPlaceholder()}
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && searchProduct()}
            disabled={isLoading}
          />
          <FontAwesomeIcon
            className='iconsearch'
            icon={faFilter}
            onClick={() => setDropdownVisible(!isDropdownVisible)}
          />
          <button
            className='search-button'
            onClick={searchProduct}
            disabled={isLoading}
          >
            {isLoading ? 'Đang tìm kiếm...' : 'Tìm kiếm'}
          </button>
        </label>
        {isDropdownVisible && (
          <ul className='filter-dropdown' ref={dropdownRef}>
            {['theo tên máy', '3 số đầu imel', '3 số cuối imel'].map(
              (opt, i) => (
                <li
                  key={i}
                  onClick={() => {
                    setFilterOption(opt)
                    setDropdownVisible(false)
                  }}
                >
                  {opt}
                </li>
              )
            )}
          </ul>
        )}
      </div>
      <div className='user'>
        {(userdata.data.user[0].role === 'manager' ||
          userdata.data.user[0].quyen.includes('quanly')) && (
          <div className='divthemkho'>
            <Tippy content='Thêm kho' placement='bottom'>
              <button className='btnicon' onClick={() => setIsOpen(true)}>
                <FontAwesomeIcon className='iconhelp' icon={faPlus} />
              </button>
            </Tippy>
          </div>
        )}
        <ListKho
          datakho={datakho}
          selectedKho={selectedKho}
          setSelectedKho={setSelectedKho}
        />
        <div className='optiontk'>
          <img
            src='https://gcs.tripi.vn/public-tripi/tripi-feed/img/474014bom/anh-gai-xinh-cute-de-thuong-hot-girl-2.jpg'
            alt=''
          />
          <h4 className='name_header'>{name}</h4>
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
            <button
              className='btnicon'
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <FontAwesomeIcon className='iconhelp' icon={faBell} />
            </button>
          </Tippy>
          {showNotifications && <NotificationsList />}
          <Tippy content='Trợ giúp' placement='bottom'>
            <button
              className='btnicon'
              onClick={() => navigate('/trogiuptongquan')}
            >
              <FontAwesomeIcon className='iconhelp' icon={faCircleQuestion} />
            </button>
          </Tippy>
        </div>
      </div>
      <AddKho
        onClose={() => setIsOpen(false)}
        isOpen={isOpen}
        userId={userId}
        setdatakho={setdatakho}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        setSelectedKho={setSelectedKho}
      />
      {isModalOpen && (
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
            style={{ display: 'flex', alignItems: 'center', margin: '20px 0', gap:'10px' }}
          >
            <ListKho
              datakho={datakho}
              setdatakho={setdatakho}
              setloading={setloading}
              selectedKho={selectedKho}
              setSelectedKho={setSelectedKho}
            />
            {(userdata.data.user[0].role === 'manager' ||
              userdata.data.user[0].quyen.includes('quanly')) && (
              <div className='divthemkho'>
                <Tippy content='Thêm kho' placement='bottom'>
                  <button
                    className='btnicon'
                    onClick={() => setIsOpen(true)}
                    style={{
                      width: '50px',
                      height: '50px'
                    }}
                  >
                    Thêm kho
                  </button>
                </Tippy>
              </div>
            )}
          </div>
        </Modal>
      )}
      {isLoading && <Loading />}
    </div>
  )
}

export default Header
