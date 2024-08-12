import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBars,
  faBell,
  faCircleQuestion,
  faSearch
} from '@fortawesome/free-solid-svg-icons'
import './Header.scss'
import { faFacebookMessenger } from '@fortawesome/free-brands-svg-icons'

function Header ({ toggleMenu, userId, name }) {
  const [datakho, setdatakho] = useState([])
  const hadleGetKho = async () => {
    try {
      const response = await fetch(
        `https://www.ansuataohanoi.com/getdepot/${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        setdatakho(data)
      } else {
        console.error('Failed to fetch data')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    if (userId) {
      hadleGetKho()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

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
        <select name='' className='option' disabled={datakho.length === 0}>
          {datakho.length === 0 ? (
            <option value=''>Chưa có kho</option>
          ) : (
            datakho.map(kho => (
              <option key={kho._id} value={kho._id}>
                {kho.name}
              </option>
            ))
          )}
        </select>

        <div className='optiontk'>
          <img
            src='https://gcs.tripi.vn/public-tripi/tripi-feed/img/474014bom/anh-gai-xinh-cute-de-thuong-hot-girl-2.jpg'
            alt=''
          />
          <h4>{name}</h4>
        </div>
        <div className='help'>
          <FontAwesomeIcon className='iconhelp' icon={faFacebookMessenger} />
          <FontAwesomeIcon className='iconhelp' icon={faBell} />
          <FontAwesomeIcon className='iconhelp' icon={faCircleQuestion} />
        </div>
      </div>
    </div>
  )
}

export default Header
