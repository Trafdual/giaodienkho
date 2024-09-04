
import React, { useRef, useEffect, useState } from 'react'
import { Modal } from '../../../../../components/Modal'
import { BrowserMultiFormatReader } from '@zxing/library'

function FormAddImel ({ isOpen, onClose, loaispid, setsanpham }) {
  const [barcodeData, setBarcodeData] = useState('')
  const videoRef = useRef(null)
  const [isScanning, setIsScanning] = useState(false)

  const handleClose = () => {
    onClose()
    setBarcodeData('') // Clear scanned data when closing
    setIsScanning(false) // Stop scanning when closing
  }

  useEffect(() => {
    if (isOpen) {
      const codeReader = new BrowserMultiFormatReader()

      const startScan = async () => {
        try {
          const videoElement = videoRef.current
          setIsScanning(true)
          await codeReader.decodeFromVideoDevice(
            null,
            videoElement,
            (result, error) => {
              if (result) {
                setBarcodeData(result.text)
                setIsScanning(false) // Stop scanning on successful read
                // Handle scanned data
                setsanpham(result.text)
              }
              if (error && !result) {
                console.error(error)
              }
            }
          )
        } catch (error) {
          console.error(error)
        }
      }

      startScan()

      return () => {
        codeReader.reset()
        setIsScanning(false)
      }
    }
  }, [isOpen, setsanpham])

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className='divAddSanPham'>
        <h2>Quét Imel</h2>
        <div>
          <video ref={videoRef} style={{ width: '100%', height: 'auto' }} />
        </div>
        {barcodeData && (
          <div>
            <h3>Thông tin quét được:</h3>
            <p>{barcodeData}</p>
          </div>
        )}
        <button onClick={handleClose} className='btnhuyAddLoHang'>
          Hủy
        </button>
      </div>
    </Modal>
  )
}

export default FormAddImel


