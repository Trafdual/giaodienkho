import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBars,
  faBell,
  faCircleQuestion,
  faPlus,
  faSearch
} from '@fortawesome/free-solid-svg-icons'
import { faFacebookMessenger } from '@fortawesome/free-brands-svg-icons'
import Tippy from '@tippyjs/react'

import 'tippy.js/dist/tippy.css'
import './Header.scss'
import { ListKho } from './ListKho'
import { AddKho } from './AddKho'

function Header ({ toggleMenu, userId, name }) {
  const [datakho, setdatakho] = useState([])

  const [isOpen, setIsOpen] = useState(false)

  const handleCloseModal = () => {
    setIsOpen(false)
  }

  return (
    <div className='topbar'>
      <div className='toggle' onClick={toggleMenu}>
        <FontAwesomeIcon style={{ fontSize: 20 }} icon={faBars} />
      </div>
      <div className='search'>
        <label>
          <input type='text' placeholder='Search here' />
          <FontAwesomeIcon className='iconsearch' icon={faSearch} />
        </label>
      </div>
      <div className='user'>
        <div className='divthemkho'>
          <Tippy content='Thêm kho' placement='bottom'>
            <button className='btnicon' onClick={() => setIsOpen(true)}>
              <FontAwesomeIcon className='iconhelp' icon={faPlus} />
            </button>
          </Tippy>
        </div>
        <ListKho datakho={datakho} setdatakho={setdatakho}/>
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
      <AddKho onClose={handleCloseModal} isOpen={isOpen} userId={userId} setdatakho={setdatakho}/>
    </div>
  )
}

export default Header
