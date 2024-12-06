import React, { useState, useRef } from 'react'
import vision from '@google-cloud/vision'

const client = new vision.ImageAnnotatorClient()

function BarcodeScanner () {
  const [scannedBarcode, setScannedBarcode] = useState('')
  const videoRef = useRef(null)

  const startScanning = () => {
    const video = videoRef.current
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    const captureFrame = () => {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      const base64Image = canvas.toDataURL('image/jpeg')

      // Gửi ảnh đến Google Vision API
      const request = {
        image: { content: base64Image.split(',')[1] }
      }

      client
        .textDetection(request)
        .then(results => {
          const detections = results[0].textAnnotations
          if (detections.length > 0) {
            setScannedBarcode(detections[0].description)
            alert(`Scanned Barcode: ${detections[0].description}`)
          }
        })
        .catch(err => {
          console.error('ERROR:', err)
        })
    }

    setInterval(captureFrame, 1000) // Quét mỗi giây
  }

  return (
    <div>
      <h2>Quét Mã Vạch</h2>
      <video ref={videoRef} style={{ width: '100%' }} autoPlay />
      <button onClick={startScanning}>Bắt đầu quét</button>
      <h3>
        {scannedBarcode ? `Mã quét: ${scannedBarcode}` : 'Chưa có mã quét'}
      </h3>
    </div>
  )
}

export default BarcodeScanner
