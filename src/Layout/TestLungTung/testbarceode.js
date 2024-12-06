/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react'
import { db } from '~/firebase/firebase' // Import Firebase cấu hình của bạn
import Quagga from 'quagga' // Import QuaggaJS

function Testbarceode () {
  const videoRef = useRef(null)
  const [scannedBarcode, setScannedBarcode] = useState('')

  useEffect(() => {
    const startScanning = () => {
      // Khởi tạo QuaggaJS
      Quagga.init(
        {
          inputStream: {
            name: 'Live',
            type: 'LiveStream',
            target: videoRef.current, // Đặt phần tử video
            constraints: {
              facingMode: 'environment' // Sử dụng camera sau
            }
          },
          decoder: {
            readers: [
              'code_128_reader',
              'ean_reader',
              'ean_8_reader',
              'upc_reader',
              'upc_e_reader',
              'code_39_reader'
            ]
          }
        },
        err => {
          if (err) {
            console.error('Error initializing Quagga:', err)
            return
          }
          Quagga.start() // Bắt đầu quét
        }
      )

      // Lắng nghe sự kiện khi quét thành công
      Quagga.onDetected(result => {
        const barcode = result.codeResult.code
        setScannedBarcode(barcode)
        alert(`Scanned Barcode: ${barcode}`)

        // Lưu kết quả quét vào Firebase Database
        const barcodeRef = ref(db, 'scannedBarcodes/' + barcode)
        set(barcodeRef, {
          barcodeText: barcode,
          timestamp: new Date().toISOString()
        })

        Quagga.stop() // Dừng quét sau khi có mã
      })
    }

    startScanning()

    return () => {
      if (videoRef.current) {
        Quagga.stop() // Dừng quét khi component bị unmount
      }
    }
  }, [])

  return (
    <div>
      <h2>Quét Mã Vạch</h2>
      <div>
        <video ref={videoRef} style={{ width: '100%', height: 'auto' }} />
      </div>
      <h3>
        {scannedBarcode ? `Mã quét: ${scannedBarcode}` : 'Chưa có mã quét'}
      </h3>
    </div>
  )
}

export default Testbarceode
