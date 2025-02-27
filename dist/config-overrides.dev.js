"use strict";

var _require = require('customize-cra'),
    override = _require.override,
    useBabelRc = _require.useBabelRc;

module.exports = override( // eslint-disable-next-line react-hooks/rules-of-hooks
useBabelRc(), function (config) {
  config.ignoreWarnings = [/Failed to parse source map/];
  return config;
});