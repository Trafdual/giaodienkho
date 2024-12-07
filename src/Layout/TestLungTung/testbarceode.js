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
        qrReaderRef.current.style.display = 'none' // Ẩn vùng quét sau khi quét thành công
        handleAddImel(index, decodedText)
        setData(decodedText)
        setScanning(false)
        qrScannerRef.current.clear() // Dừng và xóa scanner
      }

      // Khởi tạo Html5QrcodeScanner nếu scanning = true
      qrScannerRef.current = new Html5QrcodeScanner(
        'qr-reader',
        {
          fps: 10,
          qrbox: 300,
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
        }
      }
    }
  }, [scanning]) // Chỉ kích hoạt lại khi giá trị scanning thay đổi

  return (
    <div className='Barcode'>
      <div
        id='qr-reader'
        ref={qrReaderRef}
        style={{ display: scanning ? 'block' : 'none' }}
      >
        <div className='qr-box'></div>
        <div className='scan-line'></div>
      </div>
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
