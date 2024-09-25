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
  path: '/register',
  component: _RegisterLayout.Register,
  layout: null
}];
exports.publicRoutes = publicRoutes;
var privateRoutes = [];
exports.privateRoutes = privateRoutes;