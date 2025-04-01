module.exports = {
  plugins: {
    'postcss-modules': {
      generateScopedName: '[hash:base64:6]' // Mã hóa class thành dạng hash
    }
  }
}
