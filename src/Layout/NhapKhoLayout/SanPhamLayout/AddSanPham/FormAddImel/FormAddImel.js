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

function FormAddImel ({ isOpen, onClose, loaispid, fetchData }) {
  const [barcodeData, setBarcodeData] = useState('')
  const videoRef = useRef(null)
  const { showToast } = useToast()
  const [isScanning, setIsScanning] = useState(false)
  const [hasScanned, setHasScanned] = useState(false) // Biến để theo dõi đã quét thành công hay chưa

  const handleAddSanPham = async result => {
    try {
      const response = await fetch(
        `https://www.ansuataohanoi.com/postsp/${loaispid}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            imel: result,
            capacity: '',
            name: '',
            color: ''
          })
        }
      )
      const data = await response.json()

      if (data.message) {
        showToast(`${data.message}`, 'error')
      } else {
        fetchData()
        handleClose()
        showToast('Thêm sản phẩm thành công')
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu thêm sản phẩm:', error)
      showToast('Thêm lô hàng thất bại', 'error')
      handleClose()
    }
  }

  useEffect(() => {
    const eventSource = new EventSource('https://www.ansuataohanoi.com/events')

    eventSource.onmessage = event => {
      const newMessage = JSON.parse(event.data)
      showToast(newMessage.message)
      fetchData()
    }

    return () => {
      eventSource.close()
    }
  }, [])

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
    if (isOpen && !hasScanned) {
      // Chỉ bắt đầu quét nếu chưa quét thành công
      const codeReader = new BrowserMultiFormatReader()

      const hints = new Map()
      hints.set(DecodeHintType.POSSIBLE_FORMATS, [
        BarcodeFormat.CODE_39,
        BarcodeFormat.CODE_93,
        BarcodeFormat.CODE_128,
        BarcodeFormat.EAN_8,
        BarcodeFormat.EAN_13
      ])

      const startScan = async () => {
        try {
          const videoElement = videoRef.current
          const constraints = {
            video: {
              facingMode: 'environment',
              width: { ideal: 1920 },
              height: { ideal: 1080 },
              frameRate: {
                ideal: 100
              }
            }
          }
          setIsScanning(true)
          await codeReader.decodeFromConstraints(
            constraints,
            videoElement,
            (result, error) => {
              if (result) {
                setBarcodeData(result.text)
                setIsScanning(false) // Stop scanning after a successful scan
                setHasScanned(true) // Đánh dấu đã quét thành công
                handleAddSanPham(result.text)
              }
              if (error && !result) {
                if (error.name !== 'NotFoundException') {
                  // Chỉ hiển thị lỗi nếu không phải lỗi "NotFoundException"
                  console.error(error)
                }
              }
            },
            hints
          )
        } catch (error) {
          console.error(error)
        }
      }

      startScan()

      return () => {
        codeReader.reset()
        setIsScanning(false) // Ensure scanning is stopped on cleanup
      }
    }
  }, [isOpen, hasScanned]) // Add hasScanned to dependencies

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className='divAddSanPham' style={{ position: 'relative' }}>
        <h2>Quét IMEI</h2>
        <div className='divvideo'>
          <video
            ref={videoRef}
            className={`video ${hasScanned ? 'thanhcong' : ''}`}
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
          <button onClick={tieptucquet} className='btntieptucquet'>
            Tiếp tục quét
          </button>
        )}
      </div>
    </Modal>
  )
}

export default FormAddImel
