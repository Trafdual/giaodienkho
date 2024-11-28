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

var _TestLayout = require("~/Layout/TestLayout");

var _BaoCaoKhoLayout = require("~/Layout/BaoCaoKhoLayout");

var _DatePicker = _interopRequireDefault(require("~/Layout/TestLungTung/DatePicker"));

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
  component: _TestLungTung.TestLungTung
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
  path: '/test',
  component: _TestLayout.TestLayout
}, {
  path: '/baocaokho',
  component: _BaoCaoKhoLayout.BaoCaoKhoLayout
}, {
  path: '/register',
  component: _RegisterLayout.Register,
  layout: null
}, {
  path: '/calendar',
  component: _DatePicker["default"],
  layout: null
}];
exports.publicRoutes = publicRoutes;
var privateRoutes = [];
exports.privateRoutes = privateRoutes;