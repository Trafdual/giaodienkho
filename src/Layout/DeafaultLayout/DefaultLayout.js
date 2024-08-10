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

  return (
    <>
      <div className='container'>
        <Sidebar isActive={isActive} />

        <div className={`main ${isActive ? 'active' : ''}`}>
          <Header toggleMenu={toggleMenu} />
          {children}
        </div>
      </div>
    </>
  )
}

export default DefaultLayout
