import { Register } from '~/Layout/RegisterLayout'
import { Login } from '../Layout/LoginLayout'
import DashboardLayout from '~/Layout/DashboardLayout/DashboardLayout'
import XuatKhoLayout from '~/Layout/XuatKhoLayout/XuatKhoLayout'
import { NhaCungCap } from '~/Layout/NhaCungCapLayout'
import { NhapKhoLayout } from '~/Layout/NhapKhoLayout'
import { DieuChuyenLayout } from '~/Layout/DieuChuyenLayout'
import { LenhDieuChuyenLayout } from '~/Layout/LenhDieuChuyenLayout'
import { BanHangLayout } from '~/Layout/BanHangLayout'
import { TroGiupLayout } from '~/Layout/TroGiupLayout'
import { TestLungTung } from '~/Layout/TestLungTung'
import { KhachHangLayout } from '~/Layout/KhachHangLayout'
import { DoanhThuLayout } from '~/Layout/DoanhThuLayout'
import { HoaDonLayout } from '~/Layout/HoaDonLayout'
import { ThietLapLayout } from '~/Layout/ThietLapLayout'
import { SearchProductLayout } from '~/Layout/SearchProductLayout'
import { BaoCaoKhoLayout } from '~/Layout/BaoCaoKhoLayout'
import { TroGiupTongQuan } from '~/Layout/TroGiupTongQuan'
import Testbarceode from '~/Layout/TestLungTung/testbarceode'
import SupportChat from '~/Layout/TroGiupTongQuan/TongDaiTuVan/SupportChat'

  
const publicRoutes = [
  { path: '/', component: Login, layout: null },
  { path: '/home', component: DashboardLayout },
  { path: '/xuatkho', component: XuatKhoLayout },
  { path: '/nhapkho', component: NhapKhoLayout },
  { path: '/nhacungcap', component: NhaCungCap },
  { path: '/khachhang', component: KhachHangLayout },
  { path: '/dieuchuyen', component: DieuChuyenLayout },
  { path: '/lenhdieuchuyen', component: LenhDieuChuyenLayout },
  { path: '/banhang', component: BanHangLayout, layout: null },
  { path: '/trogiup', component: TroGiupLayout },
  { path: '/testlungtung', component: TestLungTung },
  { path: '/doanhthu', component: DoanhThuLayout },
  { path: '/hoadon', component: HoaDonLayout },
  { path: '/thietlap', component: ThietLapLayout },
  { path: '/search-products', component: SearchProductLayout },
    { path: '/test', component: Testbarceode,layout:null },
  { path: '/baocaokho', component: BaoCaoKhoLayout },
  { path: '/register', component: Register, layout: null },
  { path: '/trogiuptongquan', component: TroGiupTongQuan, layout: null },
  { path: '/supportchat', component: SupportChat, layout: null },




]
const privateRoutes = []
export { publicRoutes, privateRoutes }
