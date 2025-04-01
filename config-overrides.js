/* eslint-disable react-hooks/rules-of-hooks */
const {
  override,
  useBabelRc,
  addWebpackModuleRule
} = require('customize-cra')

const isProduction = process.env.NODE_ENV === 'production'

module.exports = override(
  useBabelRc(),

  // Ẩn cảnh báo source map
  config => {
    config.ignoreWarnings = [/Failed to parse source map/]
    return config
  },

  // Mã hóa class trong SCSS bằng CSS Modules chỉ khi ở môi trường production
  addWebpackModuleRule({
    test: /\.scss$/,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          modules: isProduction // Chỉ sử dụng CSS Modules khi môi trường production
            ? {
                auto: true,
                localIdentName: '[hash:base64:6]' // Mã hóa class thành chuỗi ngẫu nhiên
              }
            : false // Không sử dụng CSS Modules trong môi trường phát triển
        }
      },
      'sass-loader'
    ]
  })
)
