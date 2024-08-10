/* eslint-disable jsx-a11y/anchor-is-valid */

import './Sidebar.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import { faApple } from '@fortawesome/free-brands-svg-icons'

function Sidebar ({ isActive }) {
  return (
    <div className={`navigation ${isActive ? 'active' : ''}`}>
      <ul>
        <li>
          <a href='#'>
            <span className='icon'>
              <FontAwesomeIcon style={{ fontSize: 30 }} icon={faApple} />
            </span>
            <span className='title' style={{ fontSize: 30, fontWeight: 500 }}>
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
  )
}

export default Sidebar
