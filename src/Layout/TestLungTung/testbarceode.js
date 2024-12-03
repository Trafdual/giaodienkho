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
    <>
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
          width: { ideal: 1920 }, // Độ phân giải ngang mong muốn (Full HD)
          height: { ideal: 1080 }
        }}
        stopStream={!scanning}
      />
    </>
  )
}

export default Testbarceode
