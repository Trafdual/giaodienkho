// src/components/PrivateRoute.js
import { Navigate } from 'react-router-dom'
import { getFromLocalStorage } from '../MaHoaLocalStorage/MaHoaLocalStorage'

const isTokenValid = () => {
  try {
    const token = getFromLocalStorage('token')

    if (!token) return false

    const payload = JSON.parse(atob(token.split('.')[1]))
    const exp = payload.exp * 1000 // convert to ms

    return Date.now() < exp // còn hạn thì true
  } catch (error) {
    return false
  }
}

const PrivateRoute = ({ children }) => {
  return isTokenValid() ? children : <Navigate to='/' replace />
}

export default PrivateRoute
