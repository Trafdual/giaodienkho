/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react'
import './ListKho.scss'

function ListKho ({ datakho,selectedKho,setSelectedKho

 }) {
  const [isOpen, setIsOpen] = useState(false)

  const dropdownRef = useRef(null)

  const toggleMenu = () => {
    setIsOpen(prevState => !prevState)
  }

  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectKho = kho => {
    setSelectedKho(kho)
    localStorage.setItem('khoID', kho._id)
    localStorage.setItem('khoIDBH', kho._id)
    setIsOpen(false)
    window.location.reload()
  }

  return (
    <div className='dropdown' ref={dropdownRef}>
      <div className='select' onClick={toggleMenu}>
        <span className='selected'>
          {selectedKho ? selectedKho.name : 'Chọn kho'}
        </span>
        <div className={`caret ${isOpen ? 'carte-rotate' : ''}`}></div>
      </div>
      <ul className={`menu ${isOpen ? 'show' : ''}`}>
        {datakho.length === 0 ? (
          <li value=''>Chưa có kho</li>
        ) : (
          datakho.map(kho => (
            <li
              key={kho._id}
              value={kho._id}
              onClick={() => handleSelectKho(kho)}
            >
              {kho.name}
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

export default React.memo(ListKho)
