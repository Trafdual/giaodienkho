import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Sidebar.scss'
import { Link } from 'react-router-dom'
import { faHouse } from '@fortawesome/free-solid-svg-icons'

function Sidebar () {
  return (
    <aside className='sidebar'>
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
  )
}

export default Sidebar
