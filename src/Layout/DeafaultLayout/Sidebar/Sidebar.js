import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Sidebar.scss'
import { Link,useNavigate  } from 'react-router-dom'
import { faHouse, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { publicRoutes } from '../../../router';
function Sidebar () {
  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    navigate(publicRoutes[0].path, { replace: true });
  };
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
        
        <li>
          <FontAwesomeIcon icon={faRightFromBracket} />
         
          <p onClick={handleLogout}>Đăng xuất</p>
         
        </li>
      </ul>
    </aside>
  )
}

export default Sidebar
