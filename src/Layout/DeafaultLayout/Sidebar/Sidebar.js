import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Sidebar.scss'
import { Link } from 'react-router-dom'
function Sidebar () {
  return (
    <aside class='sidebar'>
      <ul>
        <li>
          <FontAwesomeIcon />
          <Link>
            <p>Trang Chủ</p>
          </Link>
        </li>
        <li>
          <FontAwesomeIcon />
          <Link>
            <p>Trang Chủ</p>
          </Link>
        </li>
        <li>
          <FontAwesomeIcon />
          <Link>
            <p>Trang Chủ</p>
          </Link>
        </li>
        <li>
          <FontAwesomeIcon />
          <Link>
            <p>Trang Chủ</p>
          </Link>
        </li>
      </ul>
    </aside>
  )
}

export default Sidebar
