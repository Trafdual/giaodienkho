import React, { useState } from 'react'

import './FormAddImel.scss'
import { Modal } from '~/components/Modal'
import Testbarceode from '~/Layout/TestLungTung/testbarceode'

const FormAddImel = ({ isOpen, onClose, handleAddImel, index, row }) => {
  const [scanning, setScanning] = useState(false)

  const [result, setResult] = useState('')

  const handleclose = () => {
    onClose()
    setScanning(false)
    setResult('')
  }

  return isOpen ? (
    <Modal isOpen={isOpen} onClose={() => handleclose()}>
      <h2>Thêm IMEI</h2>
      <div className='wrapper1'>
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
      </div>

      <div className='results'>
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Imel</th>
            </tr>
          </thead>
          <tbody>
            {row && row.imel && row.imel.length > 0 ? (
              row.imel.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2}>không có kết quả</td>
              </tr>
            )}
          </tbody>
        </table>
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
        <button onClick={handleclose} className='btnHuyImelist'>
          Đóng
        </button>
      </div>
    </Modal>
  ) : null
}

export default FormAddImel
