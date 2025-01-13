"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.privateRoutes = exports.publicRoutes = void 0;

var _RegisterLayout = require("~/Layout/RegisterLayout");

var _LoginLayout = require("../Layout/LoginLayout");

var _DashboardLayout = _interopRequireDefault(require("~/Layout/DashboardLayout/DashboardLayout"));

var _XuatKhoLayout = _interopRequireDefault(require("~/Layout/XuatKhoLayout/XuatKhoLayout"));

var _NhaCungCapLayout = require("~/Layout/NhaCungCapLayout");

var _NhapKhoLayout = require("~/Layout/NhapKhoLayout");

var _DieuChuyenLayout = require("~/Layout/DieuChuyenLayout");

var _LenhDieuChuyenLayout = require("~/Layout/LenhDieuChuyenLayout");

var _BanHangLayout = require("~/Layout/BanHangLayout");

var _TroGiupLayout = require("~/Layout/TroGiupLayout");

var _TestLungTung = require("~/Layout/TestLungTung");

var _KhachHangLayout = require("~/Layout/KhachHangLayout");

var _DoanhThuLayout = require("~/Layout/DoanhThuLayout");

var _HoaDonLayout = require("~/Layout/HoaDonLayout");

var _ThietLapLayout = require("~/Layout/ThietLapLayout");

var _SearchProductLayout = require("~/Layout/SearchProductLayout");

var _BaoCaoKhoLayout = require("~/Layout/BaoCaoKhoLayout");

var _TroGiupTongQuan = require("~/Layout/TroGiupTongQuan");

var _SupportChat = _interopRequireDefault(require("~/Layout/TroGiupTongQuan/TongDaiTuVan/SupportChat"));

var _QuyTienGuiLayout = require("~/Layout/QuyTienLayout/QuyTienGuiLayout");

var _QuyTienMatLayout = require("~/Layout/QuyTienLayout/QuyTienMatLayout");

var _BaoCaoCongNoLayout = require("~/Layout/BaoCaoCongNoLayout");

var _BaoCaoBanHangLayout = require("~/Layout/BaoCaoBanHangLayout");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var publicRoutes = [{
  path: '/',
  component: _LoginLayout.Login,
  layout: null
}, {
  path: '/home',
  component: _DashboardLayout["default"]
}, {
  path: '/xuatkho',
  component: _XuatKhoLayout["default"]
}, {
  path: '/nhapkho',
  component: _NhapKhoLayout.NhapKhoLayout
}, {
  path: '/nhacungcap',
  component: _NhaCungCapLayout.NhaCungCap
}, {
  path: '/khachhang',
  component: _KhachHangLayout.KhachHangLayout
}, {
  path: '/dieuchuyen',
  component: _DieuChuyenLayout.DieuChuyenLayout
}, {
  path: '/quytiengui',
  component: _QuyTienGuiLayout.QuyTienGuiLayout
}, {
  path: '/quytienmat',
  component: _QuyTienMatLayout.QuyTienMatLayout
}, {
  path: '/lenhdieuchuyen',
  component: _LenhDieuChuyenLayout.LenhDieuChuyenLayout
}, {
  path: '/banhang',
  component: _BanHangLayout.BanHangLayout,
  layout: null
}, {
  path: '/trogiup',
  component: _TroGiupLayout.TroGiupLayout
}, {
  path: '/testlungtung',
  component: _TestLungTung.TestLungTung,
  layout: null
}, {
  path: '/doanhthu',
  component: _DoanhThuLayout.DoanhThuLayout
}, {
  path: '/hoadon',
  component: _HoaDonLayout.HoaDonLayout
}, {
  path: '/thietlap',
  component: _ThietLapLayout.ThietLapLayout
}, {
  path: '/search-products',
  component: _SearchProductLayout.SearchProductLayout
}, {
  path: '/baocaobanhang',
  component: _BaoCaoBanHangLayout.BaoCaoBanHangLayout
}, // { path: '/test', component: Testbarceode,layout:null },
{
  path: '/baocaocongno',
  component: _BaoCaoCongNoLayout.BaoCaoCongNo
}, {
  path: '/baocaokho',
  component: _BaoCaoKhoLayout.BaoCaoKhoLayout
}, {
  path: '/register',
  component: _RegisterLayout.Register,
  layout: null
}, {
  path: '/trogiuptongquan',
  component: _TroGiupTongQuan.TroGiupTongQuan,
  layout: null
}, {
  path: '/supportchat',
  component: _SupportChat["default"],
  layout: null
}];
exports.publicRoutes = publicRoutes;
var privateRoutes = [];
exports.privateRoutes = privateRoutes;