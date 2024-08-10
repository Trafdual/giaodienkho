"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.privateRoutes = exports.publicRoutes = void 0;

var _LoginLayout = require("../Layout/LoginLayout");

var _DashboardLayout = _interopRequireDefault(require("~/Layout/DashboardLayout/DashboardLayout"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var publicRoutes = [{
  path: '/',
  component: _LoginLayout.Login,
  layout: null
}, {
  path: '/home',
  component: _DashboardLayout["default"]
}];
exports.publicRoutes = publicRoutes;
var privateRoutes = [];
exports.privateRoutes = privateRoutes;