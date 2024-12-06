import React, { useState, useEffect } from 'react'
import BarcodeScannerComponent from 'react-qr-barcode-scanner'
import './test.scss'

function Testbarceode ({
  setData,
  handleAddImel,
  index,
  scanning,
  setScanning
}) {
  const [debouncedResult, setDebouncedResult] = useState(null)

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
          width: { ideal: 2560 }, // Độ phân giải cao hơn
          height: { ideal: 1440 }
        }}
        stopStream={!scanning}
      />
      <div className='scanner-overlay'>
        <div className='overlay-top'></div>
        <div className='overlay-bottom'></div>
        <div className='overlay-left'></div>
        <div className='overlay-right'></div>
        <div className='scanner-box'></div>
      </div>
    </div>
  )
}

export default Testbarceode
