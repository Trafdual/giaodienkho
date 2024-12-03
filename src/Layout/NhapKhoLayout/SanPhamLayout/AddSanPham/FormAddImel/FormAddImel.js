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
      <Testbarceode
        setData={setResult}
        handleAddImel={handleAddImel}
        index={index}
        scanning={scanning}
        setScanning={setScanning}
      />
      <div className='results'>
        <h3>Kết quả: {result}</h3>
      </div>
      <button
        onClick={() => {
          setScanning(!scanning)
        }}
      >
        bắt đầu quét
      </button>
      <button onClick={handleclose}>Đóng</button>
    </Modal>
  ) : null
}

export default FormAddImel
