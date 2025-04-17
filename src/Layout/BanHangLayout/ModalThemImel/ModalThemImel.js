import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import Draggable from 'react-draggable'
import './ModalThemImel.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { motion, AnimatePresence } from 'framer-motion'

const ModalThemImel = ({
  isOpen,
  onClose,
  imeiList,
  onConfirm,
  allSelectedImeis
}) => {
  const [selectedImeis, setSelectedImeis] = useState([])

  const handleCheckboxChange = (e, imei) => {
    if (e.target.checked) {
      setSelectedImeis(prev => [...prev, imei])
    } else {
      setSelectedImeis(prev => prev.filter(imel => imel !== imei))
    }
  }

  const handleConfirm = () => {
    onConfirm(selectedImeis)
    onClose()
    setSelectedImeis([])
  }
  const filteredImeis = imeiList.filter(
    imei => !allSelectedImeis.includes(imei.imel)
  )

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className='ModalThemImel-overlay' onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: '-50%' }}
            animate={{ opacity: 1, scale: 1, y: '0%' }}
            exit={{ opacity: 0, scale: 0.8, y: '-50%' }}
            transition={{ duration: 0.3 }}
            onClick={e => e.stopPropagation()}
          >
            <Draggable handle='.ModalThemImel-header'>
              <div
                className='ModalThemImel-content'
                onClick={e => e.stopPropagation()}
              >
                <div className='ModalThemImel-header'>
                  <h3 className='ModalThemImel-title'>Serial/IMEI</h3>
                  <button className='ModalThemImel-close' onClick={onClose}>
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </div>

                <div className='ModalThemImel-body'>
                  <div className='ModalThemImel-list'>
                    <ul>
                      {filteredImeis.length > 0 ? (
                        filteredImeis.map((imei, index) => (
                          <li key={index}>
                            <label className='ModalThemImel-label'>
                              <input
                                type='checkbox'
                                value={imei.imel}
                                onChange={e =>
                                  handleCheckboxChange(e, imei.imel)
                                }
                                className='custom-checkbox-input'
                              />
                              <span className='custom-checkbox-box'></span>
                              {typeof imei.imel === 'string' ||
                              typeof imei.imel === 'number'
                                ? imei.imel
                                : JSON.stringify(imei.imel) ||
                                  'Không có thông tin IMEI'}
                            </label>
                          </li>
                        ))
                      ) : (
                        <li style={{ textAlign: 'center' }}>Không có imel</li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className='ModalThemImel-footer'>
                  <button
                    className='ModalThemImel-confirm'
                    onClick={handleConfirm}
                  >
                    Đồng ý
                  </button>
                  <button className='ModalThemImel-cancel' onClick={onClose}>
                    Đóng
                  </button>
                </div>
              </div>
            </Draggable>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}

export default ModalThemImel
