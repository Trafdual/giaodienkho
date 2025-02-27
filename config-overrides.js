const { override, useBabelRc } = require('customize-cra')

module.exports = override(
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useBabelRc(),

  config => {
    config.ignoreWarnings = [/Failed to parse source map/]
    return config
  }
)
