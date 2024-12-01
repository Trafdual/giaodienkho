import React, { useEffect, useRef, useState } from 'react'
import Quagga from '@ericblade/quagga2'
import { Modal } from '../../../../../components/Modal'
import { useToast } from '../../../../../components/GlobalStyles/ToastContext'
import './FormAddImel.scss'

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
            width: { ideal: 1920 }, // Độ rộng mong muốn (Full HD)
            height: { ideal: 1080 }, // Độ cao mong muốn (Full HD)
            facingMode: 'environment' // Sử dụng camera sau
          }
        },
        decoder: {
          readers: [
            'code_128_reader', // Mã Code 128
            'ean_reader', // Mã EAN-13
            'ean_8_reader', // Mã EAN-8
            'code_39_reader', // Mã Code 39
            'code_39_vin_reader', // Mã Code 39 VIN
            'codabar_reader', // Mã Codabar
            'upc_reader', // Mã UPC-A
            'upc_e_reader', // Mã UPC-E
            'i2of5_reader', // Mã Interleaved 2 of 5
            '2of5_reader', // Mã Standard 2 of 5
            'qr_reader' // Mã QR Code
          ]
          // Thêm loại mã vạch cần quét
        },
        locator: {
          patchSize: 'medium', // Có thể là 'small', 'medium', 'large'
          halfSample: true
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
    if (Quagga && Quagga.stop) {
      try {
        Quagga.stop()
      } catch (error) {
        console.error('Lỗi khi dừng Quagga:', error)
      }
    }
  }

  useEffect(() => {
    if (isOpen) {
      startQuagga()
    } else {
      stopQuagga()
    }

    return () => stopQuagga()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <video ref={videoRef} className='video' playsInline muted autoPlay />
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
