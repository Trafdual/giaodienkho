import { Register } from '~/Layout/RegisterLayout'
import { Login } from '../Layout/LoginLayout'
import DashboardLayout from '~/Layout/DashboardLayout/DashboardLayout'
import XuatKhoLayout from '~/Layout/XuatKhoLayout/XuatKhoLayout'
import { NhaCungCap } from '~/Layout/NhaCungCapLayout'
import { NhapKhoLayout } from '~/Layout/NhapKhoLayout'
import { DieuChuyenLayout } from '~/Layout/DieuChuyenLayout'
import { BanHangLayout } from '~/Layout/BanHangLayout'
import { KhachHangLayout } from '~/Layout/KhachHangLayout'
import { DoanhThuLayout } from '~/Layout/DoanhThuLayout'
import { HoaDonLayout } from '~/Layout/HoaDonLayout'
import { ThietLapLayout } from '~/Layout/ThietLapLayout'
import { SearchProductLayout } from '~/Layout/SearchProductLayout'
import { TestLayout } from '~/Layout/TestLayout'

const publicRoutes = [
  { path: '/', component: Login, layout: null },
  { path: '/home', component: DashboardLayout },
  { path: '/xuatkho', component: XuatKhoLayout },
  { path: '/nhapkho', component: NhapKhoLayout },
  { path: '/nhacungcap', component: NhaCungCap },
  { path: '/khachhang', component: KhachHangLayout },
  { path: '/dieuchuyen', component: DieuChuyenLayout },
  { path: '/banhang', component: BanHangLayout, layout: null },
  { path: '/doanhthu', component: DoanhThuLayout },
  { path: '/hoadon', component: HoaDonLayout },
  { path: '/thietlap', component: ThietLapLayout },
  { path: '/search-products', component: SearchProductLayout },
  { path: '/test', component: TestLayout },
  { path: '/register', component: Register, layout: null }
]
const privateRoutes = []
export { publicRoutes, privateRoutes }
