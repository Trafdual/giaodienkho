import React, { useState, useRef, useEffect, useCallback } from 'react'
import Quagga from '@ericblade/quagga2'
import { Scanner } from '../Scanner' // Scanner tùy chỉnh của bạn
import './FormAddImel.scss'
import { Modal } from '~/components/Modal'

const FormAddImel = ({ isOpen, onClose, handleAddImel, index }) => {
  const [scanning, setScanning] = useState(false) // Trạng thái bật/tắt quét
  const [cameras, setCameras] = useState([]) // Danh sách các camera khả dụng
  const [cameraId, setCameraId] = useState(null) // ID của camera đang được chọn
  const [cameraError, setCameraError] = useState(null) // Thông báo lỗi camera (nếu có)
  const [results, setResults] = useState([]) // Kết quả quét
  const [torchOn, setTorch] = useState(false) // Trạng thái bật/tắt đèn flash
  const scannerRef = useRef(null) // Tham chiếu đến DOM của scanner

  // Lấy danh sách camera khả dụng khi component mount
  useEffect(() => {
    if (!isOpen) return

    const enableCamera = async () => {
      await Quagga.CameraAccess.request(null, {})
    }
    const disableCamera = async () => {
      await Quagga.CameraAccess.release()
    }
    const enumerateCameras = async () => {
      const cameras = await Quagga.CameraAccess.enumerateVideoDevices()
      return cameras
    }

    enableCamera()
      .then(disableCamera)
      .then(enumerateCameras)
      .then(cameras => setCameras(cameras))
      .then(() => Quagga.CameraAccess.disableTorch()) // Tắt đèn flash mặc định
      .catch(err => setCameraError(err))

    return () => disableCamera()
  }, [isOpen])

  // Bật/tắt đèn flash
  const onTorchClick = useCallback(() => {
    const torch = !torchOn
    setTorch(torch)
    if (torch) {
      Quagga.CameraAccess.enableTorch()
    } else {
      Quagga.CameraAccess.disableTorch()
    }
  }, [torchOn])

  // Xử lý khi quét thành công
  const onDetected = result => {
    setResults([...results, result]) // Lưu kết quả
    handleAddImel(index, result.codeResult.code) // Gọi hàm thêm IMEI
    setScanning(false) // Tắt quét sau khi thành công
  }

  return isOpen ? (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Thêm IMEI</h2>
      {cameraError ? (
        <p className='error-message'>
          Lỗi khi khởi động camera: {JSON.stringify(cameraError)}. Vui lòng kiểm
          tra quyền truy cập.
        </p>
      ) : (
        <>
          <div className='camera-selector'>
            {cameras.length === 0 ? (
              <p>Đang kiểm tra danh sách camera...</p>
            ) : (
              <select onChange={e => setCameraId(e.target.value)}>
                {cameras.map(camera => (
                  <option key={camera.deviceId} value={camera.deviceId}>
                    {camera.label || camera.deviceId}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div
            className='scanner-wrapper'
            ref={scannerRef}
            style={{ border: '2px solid red' }}
          >
            <canvas
              className='drawingBuffer'
              style={{
                top: '0',
                border: '3px solid green',
                position: 'absolute',
              }}
            />
            {scanning && (
              <Scanner
                scannerRef={scannerRef}
                cameraId={cameraId}
                onDetected={onDetected}
              />
            )}
          </div>
        </>
      )}

      <div className='results'>
        <h3>Kết quả:</h3>
        <ul>
          {results.map((result, idx) => (
            <li key={idx}>{result.codeResult?.code}</li>
          ))}
        </ul>
      </div>

      <button onClick={() => setScanning(!scanning)}>
        {scanning ? 'Dừng quét' : 'Bắt đầu quét'}
      </button>
      <button onClick={onTorchClick}>{torchOn ? 'Tắt đèn' : 'Bật đèn'}</button>
      <button onClick={onClose}>Đóng</button>
    </Modal>
  ) : null
}

export default FormAddImel
