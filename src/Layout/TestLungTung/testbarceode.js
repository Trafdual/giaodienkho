/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import './test.scss'

function TestBarcodeOCR ({
  setData,
  handleAddImel,
  index,
  scanning,
  setScanning
}) {
  const [scanResult, setScanResult] = useState(null)
  const qrReaderRef = useRef(null) // Tham chiếu đến phần tử quét QR
  const qrScannerRef = useRef(null) // Giữ tham chiếu đến Html5QrcodeScanner để quản lý

  useEffect(() => {
    if (scanning) {
      // Hàm xử lý khi quét QR thành công
      const onScanSuccess = decodedText => {
        setScanResult(decodedText)
        qrReaderRef.current.style.display = 'none'
        handleAddImel(index, decodedText)
        setData(decodedText)
        if (qrScannerRef.current) {
          qrScannerRef.current
            .stop()
            .then(() => {
              qrScannerRef.current.clear()
              setScanning(false)
            })
            .catch(err => {
              console.error('Failed to stop scanner:', err)
            })
        }
      }

      qrScannerRef.current = new Html5QrcodeScanner(
        'qr-reader',
        {
          fps: 10,
          qrbox: {
            width: 300,
            height: 100
          },
          facingMode: { exact: 'environment' },
          videoConstraints: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'environment'
          }
        },
        false
      )

      qrScannerRef.current.render(onScanSuccess)

      return () => {
        if (qrScannerRef.current) {
          qrScannerRef.current.clear()
          qrScannerRef.current = null
          setScanning(false)
        }
        setScanResult(null)
      }
    }
  }, [scanning]) // Chỉ kích hoạt lại khi giá trị scanning thay đổi

  return (
    <div className='Barcode'>
      <div
        id='qr-reader'
        ref={qrReaderRef}
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
      >
        {scanResult ? (
          <p>Code scanned: {scanResult}</p>
        ) : (
          <p>{!scanning && 'Click to start scanning.'}</p>
        )}
      </div>
    </div>
  )
}

export default TestBarcodeOCR
