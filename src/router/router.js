import { Register } from '~/Layout/RegisterLayout'
import { Login } from '../Layout/LoginLayout'
import DashboardLayout from '~/Layout/DashboardLayout/DashboardLayout'
import XuatKhoLayout from '~/Layout/XuatKhoLayout/XuatKhoLayout'
import { NhapKhoLayout } from '~/Layout/NhapKhoLayout'

const publicRoutes = [
  { path: '/', component: Login, layout: null },
  { path: '/home', component: DashboardLayout },
  { path: '/xuatkho', component: XuatKhoLayout},
  { path: '/nhapkho', component: NhapKhoLayout},
  { path: '/register', component: Register, layout: null }
]
const privateRoutes = []
export { publicRoutes, privateRoutes }
