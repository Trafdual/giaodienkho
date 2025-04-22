// src/components/PrivateRoute.js
import { Navigate } from 'react-router-dom'
import { getFromLocalStorage } from '../MaHoaLocalStorage/MaHoaLocalStorage'

const isTokenValid = () => {
  try {
    const token = getFromLocalStorage('token')

    if (!token) {
      localStorage.clear()
      return false
    }

    const payload = JSON.parse(atob(token.split('.')[1]))
    const exp = payload.exp * 1000 // convert to ms

    if (Date.now() >= exp) {
      localStorage.clear() // Token hết hạn thì xóa hết storage
      return false
    }

    return true // Token còn hạn
  } catch (error) {
    localStorage.clear()
    return false
  }
}

const PrivateRoute = ({ children }) => {
  return isTokenValid() ? children : <Navigate to='/' replace />
}

export default PrivateRoute
