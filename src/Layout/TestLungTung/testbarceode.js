/* eslint-disable no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import './test.scss'
import { useToast } from '~/components/GlobalStyles/ToastContext'

function TestBarcodeOCR ({
  handleAddImel,
  index,
  scanning,
  setScanning,
  setrowimel
}) {
  const html5QrcodeRef = useRef(null)
  const { showToast } = useToast()

  useEffect(() => {
    const startCamera = async () => {
      try {
        const cameraId = (await Html5Qrcode.getCameras())[0].id // Chọn camera mặc định
        html5QrcodeRef.current = new Html5Qrcode('qr-reader')

        await html5QrcodeRef.current.start(
          { deviceId: cameraId },
          {
            fps: 10,
            qrbox: { width: 300, height: 100 },
            facingMode: { exact: 'environment' },
            videoConstraints: {
              width: { ideal: 1280 },
              height: { ideal: 720 },
              facingMode: 'environment'
            },
            aspectRatio: 1.7777778
          },
          decodedText => {
            setrowimel(prev => {
              if (prev.includes(decodedText)) {
                showToast('Imel đã tồn tại trong danh sách', 'error')
                return prev
              }
              handleAddImel(index, decodedText)
              return [...prev, decodedText]
            })
          }
        )
      } catch (err) {
        console.error('Lỗi khi mở camera:', err)
        alert('Không thể mở camera. Vui lòng kiểm tra cài đặt quyền truy cập.')
      }
    }

    if (scanning) {
      startCamera()
    } else {
      stopCamera()
    }

    const stopCamera = async () => {
      if (html5QrcodeRef.current) {
        await html5QrcodeRef.current.stop()
        html5QrcodeRef.current.clear()
        html5QrcodeRef.current = null
        setScanning(false)
      }
    }

    return () => {
      stopCamera()
    }
  }, [scanning])

  return (
    <>
      <div
        id='qr-reader'
        style={{ display: scanning ? 'block' : 'none' }}
      ></div>
      <div
        id='result'
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          fontSize: '1.5rem',
          color: 'white'
        }}
      ></div>
    </>
  )
}

export default TestBarcodeOCR
