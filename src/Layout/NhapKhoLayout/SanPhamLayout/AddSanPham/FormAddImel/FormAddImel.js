import React, { useRef, useEffect, useState } from 'react'
import { Modal } from '../../../../../components/Modal'
import {
  BrowserMultiFormatReader,
  DecodeHintType,
  BarcodeFormat
} from '@zxing/library'
import './FormAddImel.scss'

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
      // Create an instance of the reader
      const codeReader = new BrowserMultiFormatReader()

      // Set up the hints with the possible formats you want to scan
      const hints = new Map()
      hints.set(DecodeHintType.POSSIBLE_FORMATS, [
        BarcodeFormat.AZTEC,
        BarcodeFormat.CODABAR,
        BarcodeFormat.CODE_39,
        BarcodeFormat.CODE_93,
        BarcodeFormat.CODE_128,
        BarcodeFormat.DATA_MATRIX,
        BarcodeFormat.EAN_8,
        BarcodeFormat.EAN_13,
        BarcodeFormat.ITF,
        BarcodeFormat.MAXICODE,
        BarcodeFormat.PDF_417,
        BarcodeFormat.QR_CODE,
        BarcodeFormat.RSS_14,
        BarcodeFormat.RSS_EXPANDED,
        BarcodeFormat.UPC_A,
        BarcodeFormat.UPC_E,
        BarcodeFormat.UPC_EAN_EXTENSION
      ])

      const startScan = async () => {
        try {
          const videoElement = videoRef.current
          const constraints = {
            video: {
              facingMode: 'environment',
              width: { ideal: 1280 },
              height: { ideal: 720 }
            }
          }
          setIsScanning(true)
          await codeReader.decodeFromConstraints(
            constraints,
            videoElement,
            (result, error) => {
              if (result) {
                setBarcodeData(result.text)
                setIsScanning(false)
              }
              if (error && !result) {
                console.error(error)
              }
            },
            hints // Provide the hints here directly to the decode method
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
      <div className='divAddSanPham' style={{ position: 'relative' }}>
        <h2>Quét IMEI</h2>
        <div className='divvideo'>
          <video ref={videoRef} className='video' />
          <div className='scanner-line'></div>
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
