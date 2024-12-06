import React, { useEffect, useRef } from 'react'
import { BarcodeScanner } from 'dynamsoft-javascript-barcode'

function Testbarceode () {
  const videoRef = useRef(null)

  useEffect(() => {
    let scanner

    (async () => {
      scanner = await BarcodeScanner.createInstance()
      await scanner.setUIElement(videoRef.current)
      scanner.onFrameRead = results => {
        if (results.length > 0) {
          alert(results[0].barcodeText)
          scanner.stop() // Dừng quét khi đã nhận mã.
        }
      }
      scanner.onUnduplicatedRead = (txt, result) => {
        console.log(txt)
      }
      scanner.start()
    })()
    return () => {
      if (scanner) scanner.destroy()
    }
  })

  return (
    <div>
      <h2>Quét IMEI</h2>
      <div ref={videoRef} style={{ width: '100%', height: 'auto' }}></div>
      <button>Đóng</button>
    </div>
  )
}

export default Testbarceode
