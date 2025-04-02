"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getApiUrl = void 0;
var encryptedApis = {
  domain: process.env.REACT_APP_DOMAIN_BACKEND
};

var getApiUrl = function getApiUrl(key) {
  if (encryptedApis[key]) {
    return encryptedApis[key];
  }

  console.error("API v\u1EDBi key \"".concat(key, "\" kh\xF4ng t\u1ED3n t\u1EA1i"));
  return null;
};

exports.getApiUrl = getApiUrl;