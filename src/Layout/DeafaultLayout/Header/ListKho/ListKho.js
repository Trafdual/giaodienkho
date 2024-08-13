/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from 'react'
import './ListKho.scss'

function ListKho ({ userId }) {
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
    hadleGetKho()
  }, [userId])

  return (
    <select name='' className='option' disabled={datakho.length === 0}>
      {useCallback(
        datakho.length === 0 ? (
          <option value=''>Chưa có kho</option>
        ) : (
          datakho.map(kho => (
            <option key={kho._id} value={kho._id}>
              {kho.name}
            </option>
          ))
        ),
        [datakho]
      )}
    </select>
  )
}

export default React.memo(ListKho)
