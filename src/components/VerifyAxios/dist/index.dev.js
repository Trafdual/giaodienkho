"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _VerifyAxios = require("./VerifyAxios");

Object.keys(_VerifyAxios).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _VerifyAxios[key];
    }
  });
});