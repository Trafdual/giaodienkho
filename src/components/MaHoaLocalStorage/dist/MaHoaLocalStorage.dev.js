"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFromLocalStorage = exports.saveToLocalStorage = void 0;

var _cryptoJs = _interopRequireDefault(require("crypto-js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var secretKey = 'my-secret-key'; // Hàm mã hóa

var encryptData = function encryptData(data) {
  return _cryptoJs["default"].AES.encrypt(JSON.stringify(data), secretKey).toString();
};

var saveToLocalStorage = function saveToLocalStorage(key, data) {
  var encryptedData = encryptData(data);
  localStorage.setItem(key, encryptedData);
};

exports.saveToLocalStorage = saveToLocalStorage;

var decryptData = function decryptData(encryptedData) {
  var bytes = _cryptoJs["default"].AES.decrypt(encryptedData, secretKey);

  return JSON.parse(bytes.toString(_cryptoJs["default"].enc.Utf8));
};

var getFromLocalStorage = function getFromLocalStorage(key) {
  var encryptedData = localStorage.getItem(key);
  if (!encryptedData) return null;

  try {
    return decryptData(encryptedData);
  } catch (error) {
    console.error('Error decrypting data:', error);
    return null;
  }
};

exports.getFromLocalStorage = getFromLocalStorage;