/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react'
import './ListKho.scss'

function ListKho ({ userId }) {
  const [datakho, setdatakho] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedKho, setSelectedKho] = useState(null)

  const dropdownRef = useRef(null)

  const toggleMenu = () => {
    setIsOpen(prevState => !prevState)
  }

  const handleGetKho = async () => {
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

        // Kiểm tra khoID từ localStorage và cập nhật selectedKho nếu có
        const storedKhoID = localStorage.getItem('khoID')
        if (storedKhoID) {
          const storedKho = data.find(kho => kho._id === storedKhoID)
          if (storedKho) {
            setSelectedKho(storedKho)
          }
        }
      } else {
        console.error('Failed to fetch data')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    handleGetKho()
  }, [datakho])

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
    setIsOpen(false)
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