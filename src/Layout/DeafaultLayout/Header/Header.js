import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faSearch } from '@fortawesome/free-solid-svg-icons'
import './Header.scss' // Style file for Topbar

function Header ({ toggleMenu }) {
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
        <img
          src='https://gcs.tripi.vn/public-tripi/tripi-feed/img/474015QSt/anh-gai-xinh-1.jpg'
          alt='User'
        />
      </div>
    </div>
  )
}

export default Header

