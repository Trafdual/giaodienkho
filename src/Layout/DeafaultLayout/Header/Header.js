import './Header.scss'
function Header () {
  return (
    <div class='navbar'>
      <div class='container'>
        <h1>Logo</h1>
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
      </div>
    </div>
  )
}

export default Header
