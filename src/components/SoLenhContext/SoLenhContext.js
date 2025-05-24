// src/components/GlobalStyles/SolenhContext.js
import React, { createContext, useContext, useState, useCallback } from 'react'
import { getApiUrl } from '../../api/api'
import { useToast } from '../GlobalStyles/ToastContext'
import { fetchWithHMAC } from '../VerifyAxios'
const SolenhContext = createContext()

export const SolenhProvider = ({ children }) => {
  const [soluonglenh, setSoluonglenh] = useState(0)
  const { showToast } = useToast()
  const khoID = localStorage.getItem('khoID')

  const fetchsolenh = useCallback(
    () => {
      fetchWithHMAC('GET', `${getApiUrl('domain')}/soluonglenh/${khoID}`)
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            showToast(data.error, 'error')
          } else {
            setSoluonglenh(data.soluonglenh)
          }
        })
        .catch(err => {
          console.error('Error:', err)
          showToast('Lỗi khi gọi API', 'error')
        })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [showToast]
  )

  React.useEffect(() => {
    if (khoID) {
      fetchsolenh()
    }
  }, [fetchsolenh, khoID])

  return (
    <SolenhContext.Provider value={{ soluonglenh, fetchsolenh }}>
      {children}
    </SolenhContext.Provider>
  )
}

export const useSolenh = () => useContext(SolenhContext)
