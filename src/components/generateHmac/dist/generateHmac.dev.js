"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateHMACHeaders = generateHMACHeaders;

var _cryptoJs = _interopRequireDefault(require("crypto-js"));

var _api = require("../../api/api");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function generateHMACHeaders() {
  var payload = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var timestamp = Date.now().toString();
  var message = "".concat(timestamp, ":").concat(payload);
  console.log("".concat((0, _api.getApiUrl)('secretkey')));

  var signature = _cryptoJs["default"].HmacSHA256(message, "".concat((0, _api.getApiUrl)('secretkey'))).toString();

  return {
    'X-Timestamp': timestamp,
    'X-Signature': signature
  };
}