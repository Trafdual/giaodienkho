import React, { useState, useEffect } from 'react'
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

  // Hàm xử lý OCR
  const processOCR = imageData => {
    Tesseract.recognize(
      imageData, // Dữ liệu hình ảnh
      'eng', // Ngôn ngữ OCR (English)
      {
        logger: info => console.log(info) // Theo dõi tiến trình OCR
      }
    )
      .then(({ data: { text } }) => {
        setOcrText(text.trim()) // Cập nhật văn bản OCR nhận diện được
        console.log('OCR Text:', text)
      })
      .catch(err => {
        console.error('OCR Error:', err)
      })
  }

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
          width: { ideal: 2560 },
          height: { ideal: 1440 },
          frameRate: { ideal: 30 }
        }}
        stopStream={!scanning}
      />
      <canvas
        id='canvas' // Canvas dùng để xử lý hình ảnh từ camera
        style={{ display: 'none' }}
      ></canvas>
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
