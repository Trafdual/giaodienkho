import React, { useState } from 'react'

import './FormAddImel.scss'
import { Modal } from '~/components/Modal'
import Testbarceode from '~/Layout/TestLungTung/testbarceode'

const FormAddImel = ({
  isOpen,
  onClose,
  handleAddImel,
  index,
  row,
  setrowimel
}) => {
  const [scanning, setScanning] = useState(false)


  const handleclose = () => {
    onClose()
    setScanning(false)
    setrowimel([])
  }

  return isOpen ? (
    <Modal isOpen={isOpen} onClose={() => handleclose()}>
      <h2>Thêm IMEI</h2>
      <div className='wrapper1'>
        <div className='divvideo'>
          {scanning && (
            <Testbarceode
              handleAddImel={handleAddImel}
              index={index}
              scanning={scanning}
              setScanning={setScanning}
              setrowimel={setrowimel}
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
            {row.length > 0 ? (
              row.map((item, index) => (
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
