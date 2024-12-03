import React from 'react'
import BarcodeScannerComponent from 'react-qr-barcode-scanner'
import './test.scss'

function Testbarceode ({
  setData,
  handleAddImel,
  index,
  scanning,
  setScanning
}) {
  return (
    <div className="scanner-container">
      <BarcodeScannerComponent
        width={500}
        height={500}
        onUpdate={(err, result) => {
          if (result) {
            setData(result.text)
            handleAddImel(index, result.text)
            setScanning(false)
          }
        }}
        videoConstraints={{
          facingMode: 'environment',
          width: { ideal: 1920 }, // Full HD width
          height: { ideal: 1080 }
        }}
        stopStream={!scanning}
      />
      {/* Overlay khung nhận diện */}
      <div className="scanner-overlay">
        <div className="scanner-box"></div>
      </div>
    </div>
  )
}


export default Testbarceode
