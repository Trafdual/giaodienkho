/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import { useState } from 'react'
import './Test.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faHouse, faSearch } from '@fortawesome/free-solid-svg-icons'
import { faApple } from '@fortawesome/free-brands-svg-icons'

function Test ({ children }) {
  const [isActive, setIsActive] = useState(false)

  const toggleMenu = () => {
    setIsActive(!isActive)
  }

  return (
    <>
      <div className='container'>
        <div className={`navigation ${isActive ? 'active' : ''}`}>
          <ul>
            <li>
              <a href='#'>
                <span className='icon'>
                  <FontAwesomeIcon style={{ fontSize: 30 }} icon={faApple} />
                </span>
                <span
                  className='title'
                  style={{ fontSize: 30, fontWeight: 500 }}
                >
                  Brand Name
                </span>
              </a>
            </li>
            <li className='hovered'>
              <a href='#'>
                <span className='icon'>
                  <FontAwesomeIcon icon={faHouse} />
                </span>
                <span className='title'>Dashboard</span>
              </a>
            </li>
            <li>
              <a href='#'>
                <span className='icon'>
                  <FontAwesomeIcon icon={faHouse} />
                </span>
                <span className='title'>Customers</span>
              </a>
            </li>
            <li>
              <a href='#'>
                <span className='icon'>
                  <FontAwesomeIcon icon={faHouse} />
                </span>
                <span className='title'>Message</span>
              </a>
            </li>
            <li>
              <a href='#'>
                <span className='icon'>
                  <FontAwesomeIcon icon={faHouse} />
                </span>
                <span className='title'>Help</span>
              </a>
            </li>
            <li>
              <a href='#'>
                <span className='icon'>
                  <FontAwesomeIcon icon={faHouse} />
                </span>
                <span className='title'>Settings</span>
              </a>
            </li>
            <li>
              <a href='#'>
                <span className='icon'>
                  <FontAwesomeIcon icon={faHouse} />
                </span>
                <span className='title'>Password</span>
              </a>
            </li>
            <li>
              <a href='#'>
                <span className='icon'>
                  <FontAwesomeIcon icon={faHouse} />
                </span>
                <span className='title'>Sign Out</span>
              </a>
            </li>
          </ul>
        </div>
        <div className={`topbar ${isActive ? 'active' : ''}`}>
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
            <img src='https://gcs.tripi.vn/public-tripi/tripi-feed/img/474015QSt/anh-gai-xinh-1.jpg' />
          </div>
        </div>

        <div className={`main ${isActive ? 'active' : ''}`}>{children}</div>
      </div>
    </>
  )
}

export default Test
