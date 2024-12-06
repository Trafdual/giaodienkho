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

  // Hàm xử lý OCR từ video
  const captureImageAndProcessOCR = () => {
    const videoElement = videoRef.current

    if (videoElement) {
      if (videoElement.style && videoElement.style.zoom) {
        videoElement.style.zoom = 2.5 // Điều chỉnh zoom trực tiếp nếu có thể
      }
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = videoElement.videoWidth
      canvas.height = videoElement.videoHeight

      // Chụp ảnh từ video
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height)
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
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 },
          advanced: [{ zoom: 2.5 }]
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
