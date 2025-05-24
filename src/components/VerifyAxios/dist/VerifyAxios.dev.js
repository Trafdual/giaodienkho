"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.axiosWithHMAC = axiosWithHMAC;
exports.fetchWithHMAC = fetchWithHMAC;

var _axios = _interopRequireDefault(require("axios"));

var _generateHmac = require("../generateHmac");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function axiosWithHMAC(method, url) {
  var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var config = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var payload = method.toUpperCase() === 'GET' ? '' : JSON.stringify(data);
  var hmacHeaders = (0, _generateHmac.generateHMACHeaders)(payload);
  return (0, _axios["default"])(_objectSpread({
    method: method,
    url: url,
    data: method.toUpperCase() === 'GET' ? undefined : data,
    headers: _objectSpread({
      'Content-Type': 'application/json'
    }, config.headers || {}, {}, hmacHeaders)
  }, config));
}

function fetchWithHMAC(method, url) {
  var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var config = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var methodUpper = method.toUpperCase();
  var payload = methodUpper === 'GET' ? '' : JSON.stringify(data);
  var hmacHeaders = (0, _generateHmac.generateHMACHeaders)(payload);

  var headers = _objectSpread({
    'Content-Type': 'application/json'
  }, config.headers || {}, {}, hmacHeaders);

  var fetchOptions = _objectSpread({
    method: methodUpper,
    headers: headers
  }, config);

  if (methodUpper !== 'GET') {
    fetchOptions.body = JSON.stringify(data);
  }

  return fetch(url, fetchOptions);
}