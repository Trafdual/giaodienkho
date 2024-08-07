import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Sidebar.scss'
function Sidebar () {
  return (
    <div class='container1'>
      <aside class='sidebar'>
        <ul>
          <li>
            <FontAwesomeIcon />
            <a href='/'>Thành Phần 1</a>
          </li>
          <li>
            <FontAwesomeIcon />
            <a href='/'>Thành Phần 2</a>
          </li>
          <li>
            <FontAwesomeIcon />
            <a href='/'>Thành Phần 3</a>
          </li>
          <li>
            <FontAwesomeIcon />
            <a href='/'>Thành Phần 4</a>
          </li>
        </ul>
      </aside>
    </div>
  )
}

export default Sidebar
