import React, { useEffect, useRef, useState } from 'react'
import Quagga from 'quagga'
import { Modal } from '../../../../../components/Modal'
import { useToast } from '../../../../../components/GlobalStyles/ToastContext'

function FormAddImel ({ isOpen, onClose, handleAddImel, index }) {
  const videoRef = useRef(null)
  const { showToast } = useToast()
  const [barcodeData, setBarcodeData] = useState('')

  const handleAddSanPham = result => {
    try {
      handleAddImel(index, result)
      showToast('Thêm sản phẩm thành công!', 'success')
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu thêm sản phẩm:', error)
      showToast('Thêm sản phẩm thất bại', 'error')
    }
  }

  const startQuagga = () => {
    if (!videoRef.current) return

    Quagga.init(
      {
        inputStream: {
          name: 'Live',
          type: 'LiveStream',
          target: videoRef.current, // Element chứa video
          constraints: {
            facingMode: 'environment' // Sử dụng camera sau
          }
        },
        decoder: {
          readers: ['code_128_reader', 'ean_reader'] // Thêm loại mã vạch cần quét
        }
      },
      err => {
        if (err) {
          console.error('Lỗi khởi tạo Quagga:', err)
          return
        }
        Quagga.start()
      }
    )

    Quagga.onDetected(data => {
      const code = data.codeResult.code
      setBarcodeData(code)
      handleAddSanPham(code)
      Quagga.stop() // Dừng scanner sau khi quét xong
    })
  }

  const stopQuagga = () => {
    Quagga.stop()
  }

  useEffect(() => {
    if (isOpen) {
      startQuagga()
    } else {
      stopQuagga()
    }

    return () => stopQuagga()
  }, [isOpen])

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className='divAddSanPham'>
        <h2>Quét IMEI</h2>
        <div
          className='divvideo'
          ref={videoRef}
          style={{ width: '100%', height: '400px', position: 'relative' }}
        >
          <video
            ref={videoRef}
            className={`video`}
            playsInline
            muted
            autoPlay
          />
          <div className='scanner-line'></div>
        </div>
        {barcodeData && (
          <div>
            <h3>Mã quét được:</h3>
            <p>{barcodeData}</p>
          </div>
        )}
        <button onClick={onClose} className='btnhuyAddLoHang'>
          Đóng
        </button>
      </div>
    </Modal>
  )
}

export default FormAddImel
