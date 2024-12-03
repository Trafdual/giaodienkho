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
        width={600}
        height={200}
        onUpdate={(err, result) => {
          if (result) {
            setData(result.text)
            handleAddImel(index, result.text)
            setScanning(false)
          }
        }}
        stopStream={!scanning}
      />
    </>
  )
}

export default Testbarceode
