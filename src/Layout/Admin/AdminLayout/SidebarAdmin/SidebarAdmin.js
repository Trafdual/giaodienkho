/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  faBars,
  faBlog,
  faChartLine,
  faReceipt,
  faUserPlus,
  faRightFromBracket
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './SidebarAdmin.scss'
import { useState } from 'react'

function SidebarAdmin ({ activeTab }) {
  const [istoggle, setIstoggle] = useState(true)

  const menus = [
    { name: 'Users', icon: faUserPlus },
    { name: 'Blog', icon: faBlog },
    { name: 'Hóa đơn', icon: faReceipt },
    { name: 'Doanh Thu', icon: faChartLine }
  ]

  return (
    <div className={`sidebar_container ${istoggle ? 'open' : 'closed'}`}>
      <div
        className={` ${
          istoggle ? 'sidebar_header' : 'sidebar_header sidebar_header_close'
        }`}
      >
        <div className={`sidebar_logo ${istoggle ? 'show' : 'hide'}`}>
          <img
            src={require('../../../../assets/images/LOGO.png')}
            alt=''
            width={40}
            height={40}
          />
          <h3>BiCraft</h3>
        </div>
        <div className='sidebar_toggle' onClick={() => setIstoggle(!istoggle)}>
          <FontAwesomeIcon icon={faBars} />
        </div>
      </div>

      <div className='sidebar_body'>
        {menus.map((menu, index) => (
          <a href={`/admin?tab=${menu.name}`}>
            <div
              className={
                activeTab === menu.name
                  ? 'sidebar_item sidebar_item_active'
                  : 'sidebar_item'
              }
              key={index}
            >
              <FontAwesomeIcon icon={menu.icon} className='sidebar_icon' />
              <span className={`sidebar_text ${istoggle ? 'show' : 'hide'}`}>
                {menu.name}
              </span>
            </div>
          </a>
        ))}
        <a
          onClick={e => {
            e.preventDefault()
            localStorage.clear()
            window.location.href = '/'
          }}
        >
          <div className={'sidebar_item'}>
            <FontAwesomeIcon
              className='sidebar_icon'
              icon={faRightFromBracket}
            />
            <span className={`sidebar_text ${istoggle ? 'show' : 'hide'}`}>
              Đăng xuất
            </span>
          </div>
        </a>
      </div>
    </div>
  )
}

export default SidebarAdmin
