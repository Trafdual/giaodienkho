import React from 'react'
import './FormAddImel.scss'
import { Modal } from '~/components/Modal'
import Testbarceode from '~/Layout/TestLungTung/testbarceode'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'

const FormAddImel = ({
  isOpen,
  onClose,
  handleAddImel,
  index,
  row,
  setrowimel,
  handelremoveimel,
  rowindex,
  setScanning,
  scanning,
  submitProducts,
  
}) => {
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
              <th className='widthrieng'>STT</th>
              <th>Imel</th>
              <th className = 'widthrieng'></th>
            </tr>
          </thead>
          <tbody>
            {row.length > 0 ? (
              row.map((item, index) => (
                <tr key={index}>
                  <td className='widthrieng'>{index + 1}</td>
                  <td>{item}</td>
                  <td className = 'widthrieng'>
                    <button
                      className='btnDeleterow'
                      onClick={() => {
                        handelremoveimel(rowindex, index)
                        setrowimel(row.filter((_, i) => i !== index))
                      }}
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                  </td>
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
            submitProducts()
          }}
          className='btnAddImelist'
        >
          Thêm sản phẩm
        </button>
        <button onClick={handleclose} className='btnHuyImelist'>
          Đóng
        </button>
      </div>
    </Modal>
  ) : null
}

export default FormAddImel
