import React, { useState } from 'react'

import './FormAddImel.scss'
import { Modal } from '~/components/Modal'
import Testbarceode from '~/Layout/TestLungTung/testbarceode'

const FormAddImel = ({ isOpen, onClose, handleAddImel, index }) => {
  const [scanning, setScanning] = useState(true)

  const [result, setResult] = useState('')

  const handleclose = () => {
    onClose()
    setScanning(false)
  }

  return isOpen ? (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Thêm IMEI</h2>
      <div className='divvideo'>
        <Testbarceode
          setData={setResult}
          handleAddImel={handleAddImel}
          index={index}
          scanning={scanning}
          setScanning={setScanning}
        />
      </div>

      <div className='results'>
        <h3>Kết quả: {result}</h3>
      </div>
      <div className='divButtonImel'>
        <button
          onClick={() => {
            setScanning(true)
          }}
        >
          bắt đầu quét
        </button>
        <button onClick={handleclose}>Đóng</button>
      </div>
    </Modal>
  ) : null
}

export default FormAddImel
