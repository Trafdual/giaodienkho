import React, { useState, useEffect, useRef } from 'react'
import BarcodeScannerComponent from 'react-qr-barcode-scanner'
import Tesseract from 'tesseract.js'
import './test.scss'

function TestBarcodeOCR ({
  setData,
  handleAddImel,
  index,
  scanning,
  setScanning
}) {
  const [debouncedResult, setDebouncedResult] = useState(null)
  const [ocrText, setOcrText] = useState(null)
  const videoRef = useRef(null) // Tham chiếu đến video

  useEffect(() => {
    if (debouncedResult) {
      setData(debouncedResult)
      handleAddImel(index, debouncedResult)
      setScanning(false)
    }
  }, [debouncedResult, setData, handleAddImel, index, setScanning])

  // Hàm debounce
  const debounce = (func, delay) => {
    let timeoutId
    return (...args) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        func(...args)
      }, delay)
    }
  }

  const handleBarcodeUpdate = debounce(result => {
    if (result) {
      setDebouncedResult(result.text)
    }
  }, 500) // Debounce 500ms

  const preprocessImage = canvas => {
  const ctx = canvas.getContext('2d')
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    // Tăng tương phản
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const brightness = (r + g + b) / 3

    // Áp dụng ngưỡng để làm nổi bật mã vạch trắng trên nền đen
    if (brightness > 128) {
      data[i] = 255 // R
      data[i + 1] = 255 // G
      data[i + 2] = 255 // B
    } else {
      data[i] = 0
      data[i + 1] = 0
      data[i + 2] = 0
    }
  }

  ctx.putImageData(imageData, 0, 0)
}

  // Hàm xử lý OCR từ video
  const captureImageAndProcessOCR = () => {
    const videoElement = videoRef.current
    if (videoElement) {
      // Tạo canvas
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = videoElement.videoWidth
      canvas.height = videoElement.videoHeight

      // Chụp ảnh từ video
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height)
      preprocessImage(canvas)

      const imageData = canvas.toDataURL('image/png') // Chuyển ảnh sang định dạng PNG

      // Gửi ảnh vào Tesseract.js để xử lý OCR
      Tesseract.recognize(
        imageData, // Dữ liệu hình ảnh
        'eng', // Ngôn ngữ OCR (tiếng Anh)
        {
          logger: info => console.log(info) // Theo dõi tiến trình OCR
        }
      )
        .then(({ data: { text } }) => {
          setOcrText(text.trim()) // Cập nhật kết quả OCR
          console.log('OCR Text:', text)
        })
        .catch(err => {
          console.error('OCR Error:', err)
        })
    }
  }

  // Bắt đầu OCR mỗi khi video được cập nhật
  useEffect(() => {
    if (scanning) {
      const intervalId = setInterval(() => {
        captureImageAndProcessOCR() // Chụp ảnh và chạy OCR liên tục
      }, 2000) // Chạy OCR mỗi 2 giây
      return () => clearInterval(intervalId)
    }
  }, [scanning])

  return (
    <div className='scanner-container'>
      <BarcodeScannerComponent
        width={500}
        height={500}
        onUpdate={(err, result) => {
          if (result) {
            handleBarcodeUpdate(result)
          }
        }}
        videoConstraints={{
          facingMode: 'environment',
          width: { ideal: 3840 },
          height: { ideal: 2160 },
          frameRate: { ideal: 60 }
        }}
        stopStream={!scanning}
        videoRef={videoRef} // Tham chiếu video vào OCR
      />
      <div className='scanner-overlay'>
        <div className='overlay-top'></div>
        <div className='overlay-bottom'></div>
        <div className='overlay-left'></div>
        <div className='overlay-right'></div>
        <div className='scanner-box'></div>
      </div>
      {ocrText && <div className='ocr-result'>OCR Result: {ocrText}</div>}
    </div>
  )
}

export default TestBarcodeOCR
