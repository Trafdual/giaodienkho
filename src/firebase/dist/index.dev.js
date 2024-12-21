"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _firebase = require("./firebase");

Object.keys(_firebase).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _firebase[key];
    }
  });
});