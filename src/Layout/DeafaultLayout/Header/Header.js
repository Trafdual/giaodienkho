import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Header.scss'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { faHouse } from '@fortawesome/free-solid-svg-icons'

function Header () {
  return (
    <>
      <div className='navbar'>
        <div className='container'>
          <label htmlFor='nav-mobile-input'>
            <FontAwesomeIcon className='menuBar' icon={faBars} />
          </label>
          <input
            type='checkbox'
            name=''
            className='nav_input'
            id='nav-mobile-input'
          />
          <label htmlFor='nav-mobile-input' className='nav_overlay'></label>
          <aside className='sidebarHeader'>
            <ul>
              <li>
                <FontAwesomeIcon icon={faHouse} />
                <Link>
                  <p>Trang chủ</p>
                </Link>
              </li>
              <li>
                <FontAwesomeIcon icon={faHouse} />
                <Link>
                  <p>Quản lý nhân viên</p>
                </Link>
              </li>
              <li>
                <FontAwesomeIcon icon={faHouse} />
                <Link>
                  <p>Quản lý nhập kho</p>
                </Link>
              </li>
              <li>
                <FontAwesomeIcon icon={faHouse} />
                <Link>
                  <p>Quản lý xuất kho</p>
                </Link>
              </li>
              <li>
                <FontAwesomeIcon icon={faHouse} />
                <Link>
                  <p>Quản lý doanh thu</p>
                </Link>
              </li>
              <li>
                <FontAwesomeIcon icon={faHouse} />
                <Link>
                  <p>Quản lý doanh thu</p>
                </Link>
              </li>
            </ul>
          </aside>
          <h1 className='logoHeader'>Logo</h1>
          <nav>
            <ul>
              <li>
                <a href='/'>Trang Chủ</a>
              </li>
              <li>
                <a href='/'>Dịch Vụ</a>
              </li>
              <li>
                <a href='/'>Giới Thiệu</a>
              </li>
              <li>
                <a href='/'>Liên Hệ</a>
              </li>
            </ul>
          </nav>
          <div className='divLogoHeader'>
            <img src='' alt='' />
            <h3>BiCraft Technology</h3>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header
