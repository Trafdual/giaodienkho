import CryptoJS from 'crypto-js'
import { getApiUrl } from '../../api/api'

export function generateHMACHeaders (payload = '') {
  const timestamp = Date.now().toString()
  const message = `${timestamp}:${payload}`
  console.log(`${getApiUrl('secretkey')}`)
  const signature = CryptoJS.HmacSHA256(
    message,
    `${getApiUrl('secretkey')}`
  ).toString()

  return {
    'X-Timestamp': timestamp,
    'X-Signature': signature
  }
}
