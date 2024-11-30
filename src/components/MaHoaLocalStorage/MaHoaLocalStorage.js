import CryptoJS from 'crypto-js'

const secretKey = 'my-secret-key'

// Hàm mã hóa
const encryptData = data => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString()
}

export const saveToLocalStorage = (key, data) => {
  const encryptedData = encryptData(data)
  localStorage.setItem(key, encryptedData)
}

const decryptData = encryptedData => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey)
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
}

export const getFromLocalStorage = key => {
  const encryptedData = localStorage.getItem(key)
  if (!encryptedData) return null

  try {
    return decryptData(encryptedData)
  } catch (error) {
    console.error('Error decrypting data:', error)
    return null
  }
}
