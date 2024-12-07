import React, { useState, useEffect, useRef } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode' // Import thư viện html5-qrcode
import './TestLungTung.scss' // CSS riêng

function Barcode () {
  const [scanResult, setScanResult] = useState(null)
  const qrReaderRef = useRef(null) // Tham chiếu đến phần tử quét QR

  useEffect(() => {
    // Hàm xử lý khi quét QR thành công
    const onScanSuccess = (decodedText, decodedResult) => {
      setScanResult(decodedText)
      qrReaderRef.current.style.display = 'none' // Ẩn vùng quét sau khi quét thành công
    }

    // Khởi tạo Html5QrcodeScanner
    const html5QrcodeScanner = new Html5QrcodeScanner(
      'qr-reader',
      {
        fps: 120,
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

    html5QrcodeScanner.render(onScanSuccess)

    return () => {
      html5QrcodeScanner.clear()
    }
  }, [])

  return (
    <div className='Barcode'>
      <div id='qr-reader' ref={qrReaderRef}>
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
          <p>Scan a QR code to see the result.</p>
        )}
      </div>
    </div>
  )
}

export default Barcode
