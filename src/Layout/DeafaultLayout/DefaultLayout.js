/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import { useState } from 'react'

import './DefaultLayout.scss'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

function DefaultLayout ({ children }) {
  const [isActive, setIsActive] = useState(false)

  const toggleMenu = () => {
    setIsActive(!isActive)
  }
  const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId')
  const name = localStorage.getItem('name') || sessionStorage.getItem('name')

  return (
    <>
      <div className='container'>
        <Sidebar isActive={isActive} setIsActive={setIsActive}/>

        <div className={`main ${isActive ? 'active' : ''}`}>
          <Header name={name} userId={userId} toggleMenu={toggleMenu} isActive={isActive} />
          {children}
        </div>
      </div>
    </>
  )
}

export default DefaultLayout
