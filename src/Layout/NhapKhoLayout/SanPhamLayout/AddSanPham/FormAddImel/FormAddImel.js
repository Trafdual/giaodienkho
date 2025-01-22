import React, { useState } from 'react'

import './FormAddImel.scss'
import { Modal } from '~/components/Modal'
import Testbarceode from '~/Layout/TestLungTung/testbarceode'

const FormAddImel = ({ isOpen, onClose, handleAddImel, index }) => {
  const [scanning, setScanning] = useState(false)

  const [result, setResult] = useState('')

  const handleclose = () => {
    onClose()
    setScanning(false)
    setResult('')
  }

  return isOpen ? (
    <Modal isOpen={isOpen} onClose={handleclose}>
      <h2>Thêm IMEI</h2>
      <div className='divvideo'>
        {scanning && (
          <Testbarceode
            setData={setResult}
            handleAddImel={handleAddImel}
            index={index}
            scanning={scanning}
            setScanning={setScanning}
          />
        )}
      </div>

      <div className='results'>
        <h3>Kết quả: {result ? result : 'chưa có kết quả'}</h3>
      </div>
      <div className='divButtonImel'>
        <button
          onClick={() => {
            setScanning(true)
          }}
          className='btnAddImelist'
        >
          bắt đầu quét
        </button>
        <button
          onClick={handleclose}
          className='btnHuyImelist'
        >
          Đóng
        </button>
      </div>
    </Modal>
  ) : null
}

export default FormAddImel
