const encryptedApis = {
  domain: process.env.REACT_APP_DOMAIN_BACKEND,
  secretkey: process.env.REACT_APP_TRAFDUAL_BAOTECH_SECRET_KEY
}

export const getApiUrl = key => {
  if (encryptedApis[key]) {
    return encryptedApis[key]
  }
  console.error(`API với key "${key}" không tồn tại`)

  return null
}
