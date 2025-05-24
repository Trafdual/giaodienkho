import axios from 'axios'
import { generateHMACHeaders } from '../generateHmac'

export function axiosWithHMAC (method, url, data = {}, config = {}) {
  const payload = method.toUpperCase() === 'GET' ? '' : JSON.stringify(data)
  const hmacHeaders = generateHMACHeaders(payload)

  return axios({
    method,
    url,
    data: method.toUpperCase() === 'GET' ? undefined : data,
    headers: {
      'Content-Type': 'application/json',
      ...(config.headers || {}),
      ...hmacHeaders
    },
    ...config
  })
}

export function fetchWithHMAC (method, url, data = {}, config = {}) {
  const methodUpper = method.toUpperCase()

  const payload = methodUpper === 'GET' ? '' : JSON.stringify(data)

  const hmacHeaders = generateHMACHeaders(payload)

  const headers = {
    'Content-Type': 'application/json',
    ...(config.headers || {}),
    ...hmacHeaders
  }

  const fetchOptions = {
    method: methodUpper,
    headers,
    ...config
  }

  if (methodUpper !== 'GET') {
    fetchOptions.body = JSON.stringify(data)
  }

  return fetch(url, fetchOptions)
}
