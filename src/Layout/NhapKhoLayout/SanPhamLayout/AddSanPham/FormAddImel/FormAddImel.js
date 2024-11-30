/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect, useState } from 'react'
import { Modal } from '../../../../../components/Modal'
import {
  BrowserMultiFormatReader,
  DecodeHintType,
  BarcodeFormat
} from '@zxing/library'
import './FormAddImel.scss'
import { useToast } from '../../../../../components/GlobalStyles/ToastContext'

function FormAddImel ({ isOpen, onClose, handleAddImel, index }) {
  const [barcodeData, setBarcodeData] = useState('')
  const videoRef = useRef(null)
  const { showToast } = useToast()
  const [isScanning, setIsScanning] = useState(false)
  const [hasScanned, setHasScanned] = useState(true) // Biến để theo dõi đã quét thành công hay chưa

  const handleAddSanPham = async result => {
    try {
      handleAddImel(index, result)
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu thêm sản phẩm:', error)
      showToast('Thêm lô hàng thất bại', 'error')
      handleClose()
    }
  }

  // useEffect(() => {
  //   const eventSource = new EventSource('https://www.ansuataohanoi.com/events')

  //   eventSource.onmessage = event => {
  //     const newMessage = JSON.parse(event.data)
  //     showToast(newMessage.message)
  //     fetchData()
  //   }

  //   return () => {
  //     eventSource.close()
  //   }
  // }, [])

  const handleClose = () => {
    onClose()
    setBarcodeData('') // Clear scanned data when closing
    setIsScanning(false) // Stop scanning when closing
    setHasScanned(false) // Reset trạng thái đã quét khi đóng modal
  }
  const tieptucquet = () => {
    setBarcodeData('') // Clear scanned data when closing
    setIsScanning(false) // Stop scanning when closing
    setHasScanned(false) // Reset trạng thái đã quét khi đóng modal
  }

  useEffect(() => {
    if (isOpen) {
      const startCamera = async () => {
        try {
          const videoElement = videoRef.current
          const constraints = {
            video: {
              facingMode: 'environment',
              width: { ideal: 1920 },
              height: { ideal: 1080 }
            }
          }

          const stream = await navigator.mediaDevices.getUserMedia(constraints)
          videoElement.srcObject = stream
          videoElement.play()
        } catch (error) {
          console.error('Lỗi khi mở camera:', error)
          alert('Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.')
        }
      }

      startCamera()

      return () => {
        const videoElement = videoRef.current
        if (videoElement && videoElement.srcObject) {
          const stream = videoElement.srcObject
          const tracks = stream.getTracks()
          tracks.forEach(track => track.stop())
          videoElement.srcObject = null
        }
      }
    }
  }, [isOpen])

const handleCaptureAndScan = async () => {
  if (!videoRef.current) return

  const videoElement = videoRef.current
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  // Cài đặt kích thước canvas theo video
  canvas.width = videoElement.videoWidth
  canvas.height = videoElement.videoHeight

  // Vẽ khung hình hiện tại của video lên canvas
  context.drawImage(videoElement, 0, 0, canvas.width, canvas.height)

  // Tạo một đối tượng image từ canvas
  const image = new Image()
  image.src = canvas.toDataURL()

  // Đảm bảo rằng ảnh đã tải xong trước khi quét mã
  image.onload = async () => {
    const codeReader = new BrowserMultiFormatReader()

    try {
      // Quét mã từ HTMLImageElement
      const result = await codeReader.decodeFromImage(image)
      setBarcodeData(result.text) // Cập nhật mã quét được
      setHasScanned(true) // Đánh dấu đã quét xong
      handleAddSanPham(result.text) // Thêm sản phẩm với mã quét được
    } catch (error) {
      console.error('Lỗi khi quét từ ảnh:', error)
      alert('Không thể quét mã vạch từ ảnh. Vui lòng thử lại.')
    }
  }
}



  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className='divAddSanPham' style={{ position: 'relative' }}>
        <h2>Quét IMEI</h2>
        <div className='divvideo'>
          <video
            ref={videoRef}
            className={`video ${hasScanned ? 'thanhcong' : ''}`}
            playsInline
            muted
            autoPlay
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
        {hasScanned && (
          <button onClick={handleCaptureAndScan} className='btntieptucquet'>
            chụp và quét
          </button>
        )}
      </div>
    </Modal>
  )
}

export default FormAddImel
