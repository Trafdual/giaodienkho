/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import { useState, useEffect } from 'react'

import './DefaultLayout.scss'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { Loading } from '~/components/Loading'
import { getFromLocalStorage } from '~/components/MaHoaLocalStorage/MaHoaLocalStorage'

function DefaultLayout ({ children }) {
  const [isActive, setIsActive] = useState(false)
  const [loading, setloading] = useState(true)
  const [userID, setuserID] = useState(getFromLocalStorage('userId'))
  const [datakho, setdatakho] = useState([])

  const [selectedKho, setSelectedKho] = useState(null)
  const name = getFromLocalStorage('name')

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newuserID = getFromLocalStorage('userId') || ''
      if (newuserID !== userID) {
        console.log('Interval detected change, updating khoID:', newuserID)
        setuserID(newuserID)
      }
    }, 1000)

    return () => clearInterval(intervalId)
  }, [getFromLocalStorage('userId')])

  const handleGetKho = async () => {
    try {
      const response = await fetch(`https://baotech.shop/getdepot/${userID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setdatakho(data)
        setloading(false)

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
  }, [userID])

  const toggleMenu = () => {
    setIsActive(!isActive)
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className='container'>
          <Sidebar isActive={isActive} setIsActive={setIsActive} />

          <div className={`main ${isActive ? 'active' : ''}`}>
            <Header
              setloading={setloading}
              name={name}
              userId={userID}
              toggleMenu={toggleMenu}
              isActive={isActive}
              datakho={datakho}
              setdatakho={setdatakho}
              selectedKho={selectedKho}
              setSelectedKho={setSelectedKho}
            />
            {children}
          </div>
        </div>
      )}
    </>
  )
}

export default DefaultLayout
