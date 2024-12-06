import React, { useState } from 'react'
import BarcodeScanner from 'react-barcode-scanner'

function Testbarceode () {
  const [scannedData, setScannedData] = useState(null)

  const handleScan = data => {
    if (data) {
      setScannedData(data)
    }
  }

  const handleError = err => {
    console.error('Lỗi quét mã vạch:', err)
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1>Barcode Scanner</h1>
      <BarcodeScanner onError={handleError} onScan={handleScan} />
      <div style={{ marginTop: '20px', fontSize: '18px', color: 'green' }}>
        {scannedData
          ? `Kết quả quét: ${scannedData}`
          : 'Đưa mã vạch vào khung quét.'}
      </div>
    </div>
  )
}

export default Testbarceode
