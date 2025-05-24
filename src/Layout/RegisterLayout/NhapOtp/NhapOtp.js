import React, { useState, useRef } from 'react'
import { getApiUrl } from '../../../api/api'
import { useToast } from '../../../components/GlobalStyles/ToastContext'
import './NhapOtp.scss'

export default function OtpVerify ({ email, userId, onVerify }) {
  const [otp, setOtp] = useState(new Array(6).fill(''))
  const [isSending, setIsSending] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const inputsRef = useRef([])
  const { showToast } = useToast()

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/, '')
    if (!value) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (index < 5) inputsRef.current[index + 1].focus()
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (otp[index]) {
        const newOtp = [...otp]
        newOtp[index] = ''
        setOtp(newOtp)
      } else if (index > 0) {
        inputsRef.current[index - 1].focus()
      }
    }
  }

  const handleSubmit = async () => {
    const finalOtp = otp.join('')
    if (finalOtp.length !== 6) {
      showToast('Vui lòng nhập đầy đủ 6 chữ số', 'error')
      return
    }

    try {
      const res = await fetch(`${getApiUrl('domain')}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: finalOtp })
      })
      const data = await res.json()
      if (data.message) {
        onVerify()
      } else {
        showToast(data.error || 'Mã OTP không đúng', 'error')
      }
    } catch {
      showToast('Lỗi khi xác minh OTP', 'error')
    }
  }

  const handleResendOtp = async () => {
    if (!email) return
    setIsSending(true)
    try {
      const res = await fetch(`${getApiUrl('domain')}/resendemail/${email}`, {
        method: 'POST'
      })
      const data = await res.json()
      if (data.message === 'gửi thành công') {
        showToast('Đã gửi lại mã OTP', 'success')
        setCountdown(60) // countdown 60s
        const interval = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(interval)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      } else {
        showToast(data.message || 'Không thể gửi lại mã OTP', 'error')
      }
    } catch (error) {
      showToast('Lỗi khi gửi lại mã OTP', 'error')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className='otp-container'>
      <h2>Xác minh OTP</h2>
      <p>
        Đã gửi mã đến email: <strong>{email}</strong>
      </p>

      <div className='otp-inputs'>
        {otp.map((digit, idx) => (
          <input
            key={idx}
            type='text'
            maxLength='1'
            value={digit}
            onChange={e => handleChange(e, idx)}
            onKeyDown={e => handleKeyDown(e, idx)}
            ref={el => (inputsRef.current[idx] = el)}
            className='otp-box'
          />
        ))}
      </div>

      <button className='btn-submit-otp' onClick={handleSubmit}>
        Xác minh
      </button>

      <div className='resend-container'>
        {countdown > 0 ? (
          <p className='resend-wait'>Gửi lại mã sau {countdown}s</p>
        ) : (
          <button
            className='btn-resend-otp'
            onClick={handleResendOtp}
            disabled={isSending}
          >
            {isSending ? 'Đang gửi...' : 'Gửi lại mã OTP'}
          </button>
        )}
      </div>
    </div>
  )
}
