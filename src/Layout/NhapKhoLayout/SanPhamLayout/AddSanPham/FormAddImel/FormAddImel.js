import React, { useState, useRef, useEffect } from 'react'
import { Scanner } from '../Scanner'
import { Modal } from '../../../../../components/Modal'
import { useToast } from '../../../../../components/GlobalStyles/ToastContext'
import './FormAddImel.scss'

const FormAddImel = ({ isOpen, onClose, handleAddImel, index }) => {
  const [barcodeData, setBarcodeData] = useState('')
  const scannerRef = useRef(null)
  const { showToast } = useToast()
  const [scanning, setScanning] = useState(false)
  const [hasScanned, setHasScanned] = useState(false)

  // Thêm sản phẩm sau khi quét thành công
  const handleAddSanPham = async result => {
    try {
      handleAddImel(index, result)
      setHasScanned(true)
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu thêm sản phẩm:', error)
      showToast('Thêm lô hàng thất bại', 'error')
      handleClose()
    }
  }

  // Đóng Modal và reset trạng thái
  const handleClose = () => {
    onClose()
    setBarcodeData('')
    setScanning(false)
    setHasScanned(false)
  }

  // Tiếp tục quét mã mới
  const tieptucquet = () => {
    setBarcodeData('')
    setScanning(true)
    setHasScanned(false)
  }

  // Callback khi Scanner nhận diện được mã
  const onDetected = result => {
    setBarcodeData(result)
    setScanning(false)
    setHasScanned(true)
    handleAddSanPham(result)
  }

  // Bật Scanner khi Modal mở
  useEffect(() => {
    if (isOpen && !hasScanned) {
      setScanning(true)
    }
    return () => {
      setScanning(false)
    }
  }, [isOpen, hasScanned])

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className='divAddSanPham' style={{ position: 'relative' }}>
        <h2>Quét IMEI</h2>
        <div className='divvideo' ref={scannerRef}>
          {scanning && (
            <Scanner
              scannerRef={scannerRef}
              onDetected={onDetected}
              facingMode='environment'
              constraints={{ width: 640, height: 480 }}
            />
          )}
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
