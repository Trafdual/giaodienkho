import { Register } from '~/Layout/RegisterLayout'
import { Login } from '../Layout/LoginLayout'
import DashboardLayout from '~/Layout/DashboardLayout/DashboardLayout'

const publicRoutes = [
  { path: '/', component: Login, layout: null },
  { path: '/home', component: DashboardLayout },
  { path: '/register', component: Register, layout: null }
]
const privateRoutes = []
export { publicRoutes, privateRoutes }
