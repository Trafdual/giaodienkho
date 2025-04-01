"use strict";

/* eslint-disable react-hooks/rules-of-hooks */
var _require = require('customize-cra'),
    override = _require.override,
    useBabelRc = _require.useBabelRc,
    addWebpackPlugin = _require.addWebpackPlugin,
    addWebpackModuleRule = _require.addWebpackModuleRule;

var JavaScriptObfuscator = require('webpack-obfuscator');

module.exports = override(useBabelRc(), // Ẩn cảnh báo source map
function (config) {
  config.ignoreWarnings = [/Failed to parse source map/];
  return config;
}, // Mã hóa class trong SCSS bằng CSS Modules
addWebpackModuleRule({
  test: /\.scss$/,
  use: ['style-loader', {
    loader: 'css-loader',
    options: {
      modules: {
        auto: true,
        // Bật chế độ CSS Modules cho toàn bộ file SCSS
        localIdentName: '[hash:base64:6]' // Mã hóa class thành chuỗi ngẫu nhiên

      }
    }
  }, 'sass-loader']
}), // Mã hóa JavaScript bằng Webpack Obfuscator
addWebpackPlugin(new JavaScriptObfuscator({
  rotateStringArray: true,
  stringArray: true,
  stringArrayEncoding: ['rc4'],
  // Mã hóa mạnh hơn
  stringArrayThreshold: 1
}, ['excluded_bundle.js'] // Bỏ qua file nếu cần
)));