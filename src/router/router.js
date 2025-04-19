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
import { DoanhThuLayout } from '~/Layout/DoanhThuLayout'
import { HoaDonLayout } from '~/Layout/HoaDonLayout'
import { ThietLapLayout } from '~/Layout/ThietLapLayout'
import { SearchProductLayout } from '~/Layout/SearchProductLayout'
import { BaoCaoKhoLayout } from '~/Layout/BaoCaoKhoLayout'
import { TroGiupTongQuan } from '~/Layout/TroGiupTongQuan'
// import Testbarceode from '~/Layout/TestLungTung/testbarceode'
import SupportChat from '~/Layout/TroGiupTongQuan/TongDaiTuVan/SupportChat'
import { QuyTienGuiLayout } from '~/Layout/QuyTienLayout/QuyTienGuiLayout'
import { QuyTienMatLayout } from '~/Layout/QuyTienLayout/QuyTienMatLayout'
import { BaoCaoCongNo } from '~/Layout/BaoCaoCongNoLayout'
import { BaoCaoBanHangLayout } from '~/Layout/BaoCaoBanHangLayout'
import { DanhSachHoaDonLayout } from '~/Layout/DanhSachHoaDonLayout'
import { ThuNoLayout } from '~/Layout/ThuNoLayout'
import { AdminLayout } from '~/Layout/Admin/AdminLayout'
import { NhanVienLayout } from '../Layout/NhanVienLayout'
import NhanVienLockLayout from '../Layout/NhanVienLayout/NhanVienLockLayout'
import { SkuLayout } from '../Layout/CaiDatChungLayout/SkuLayout'
const publicRoutes = [
  { path: '/', component: Login, layout: null },
  { path: '/home', component: DashboardLayout },
  { path: '/xuatkho', component: XuatKhoLayout },
  { path: '/nhapkho', component: NhapKhoLayout },
  { path: '/nhacungcap', component: NhaCungCap },
  { path: '/dieuchuyen', component: DieuChuyenLayout },
  { path: '/quytiengui', component: QuyTienGuiLayout },
  { path: '/quytienmat', component: QuyTienMatLayout },
  { path: '/lenhdieuchuyen', component: LenhDieuChuyenLayout },
  { path: '/banhang', component: BanHangLayout, layout: 'banhang' },
  { path: '/trogiup', component: TroGiupLayout },
  { path: '/testlungtung', component: TestLungTung, layout: null },
  { path: '/doanhthu', component: DoanhThuLayout },
  { path: '/hoadon', component: HoaDonLayout },
  { path: '/thietlap', component: ThietLapLayout },
  { path: '/search-products', component: SearchProductLayout },
  { path: '/baocaobanhang', component: BaoCaoBanHangLayout },
  // { path: '/test', component: Testbarceode,layout:null },
  { path: '/baocaocongno', component: BaoCaoCongNo },
  { path: '/baocaokho', component: BaoCaoKhoLayout },
  { path: '/register', component: Register, layout: null },
  { path: '/trogiuptongquan', component: TroGiupTongQuan, layout: null },
  { path: '/supportchat', component: SupportChat, layout: null },
  { path: '/admin', component: AdminLayout, layout: null },
  { path: '/nhanvien/active', component: NhanVienLayout },
  { path: '/nhanvien/locked', component: NhanVienLockLayout },
  { path: '/setting/sku', component: SkuLayout },

  {
    path: '/danhsachhoadon',
    component: DanhSachHoaDonLayout,
    layout: 'banhang'
  },
  { path: '/thuno', component: ThuNoLayout, layout: 'banhang' }
]
const privateRoutes = []
export { publicRoutes, privateRoutes }
