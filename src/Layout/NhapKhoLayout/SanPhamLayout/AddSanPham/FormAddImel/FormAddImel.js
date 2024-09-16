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
  const canvasRef = useRef(null)
  const [isScanning, setIsScanning] = useState(false)

  const handleClose = () => {
    onClose()
    setBarcodeData('') 
    setIsScanning(false) 
  }

  useEffect(() => {
    if (isOpen) {
      const codeReader = new BrowserMultiFormatReader()

      const hints = new Map()
      hints.set(DecodeHintType.POSSIBLE_FORMATS, [
        BarcodeFormat.CODE_39,
        BarcodeFormat.CODE_93,
        BarcodeFormat.CODE_128,
        BarcodeFormat.EAN_8,
        BarcodeFormat.EAN_13,
        BarcodeFormat.QR_CODE
      ])

      const startScan = async () => {
        try {
          const videoElement = videoRef.current
          const canvasElement = canvasRef.current
          const context = canvasElement.getContext('2d')
          const constraints = {
            video: {
              facingMode: 'environment',
              width: { ideal: 1280 },
              height: { ideal: 720 },
              frameRate: { ideal: 30 }
            }
          }

          // Yêu cầu quyền truy cập camera và thiết lập các thuộc tính của video
          const stream = await navigator.mediaDevices.getUserMedia(constraints)
          videoElement.srcObject = stream

          // Khởi động video khi có dữ liệu
          videoElement.onloadedmetadata = () => {
            videoElement.play()
          }

          setIsScanning(true)

          const scanFrame = () => {
            if (!videoElement || !context) return

            // Vẽ video lên canvas
            context.drawImage(
              videoElement,
              0,
              0,
              canvasElement.width,
              canvasElement.height
            )

            // Lấy dữ liệu ảnh từ canvas
            const imageData = context.getImageData(
              0,
              0,
              canvasElement.width,
              canvasElement.height
            )

            // Quét mã vạch từ dữ liệu ảnh
            codeReader
              .decodeFromImageData(imageData)
              .then(result => {
                setBarcodeData(result.text)
                setIsScanning(false) // Stop scanning after a successful scan
              })
              .catch(error => {
                if (error) {
                  console.error('Scan error:', error)
                }
              })

            // Tiếp tục quét
            if (isScanning) {
              requestAnimationFrame(scanFrame)
            }
          }

          // Khởi động quét
          scanFrame()

          return () => {
            codeReader.reset()
            setIsScanning(false) // Ensure scanning is stopped on cleanup
            stream.getTracks().forEach(track => track.stop()) // Dừng camera
          }
        } catch (error) {
          console.error('Initialization error:', error)
        }
      }

      startScan()

      return () => {
        codeReader.reset()
        setIsScanning(false) // Ensure scanning is stopped on cleanup
      }
    }
  }, [isOpen, setsanpham, isScanning]) // Add isScanning to dependencies

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className='divAddSanPham' style={{ position: 'relative' }}>
        <h2>Quét IMEI</h2>
        <div className='divvideo'>
          <video ref={videoRef} className='video' />
          <canvas
            ref={canvasRef}
            className='canvas'
            style={{ display: 'none' }}
          />
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
