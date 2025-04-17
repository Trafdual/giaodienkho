import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import Draggable from 'react-draggable'
import './Modal.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { motion, AnimatePresence } from 'framer-motion'

const Modal = ({ isOpen, onClose, children }) => {
  // Kiểm tra kích thước màn hình
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleEsc = e => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768) // Giới hạn kích thước màn hình ở 768px
    }

    window.addEventListener('resize', handleResize)

    // Gọi ngay khi lần đầu render
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className='modal-overlay'>
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: '-50%' }}
            animate={{ opacity: 1, scale: 1, y: '0%' }}
            exit={{ opacity: 0, scale: 0.8, y: '-50%' }}
            transition={{ duration: 0.3 }}
            onClick={e => e.stopPropagation()}
          >
            {isMobile ? (
              <div className='modal-content' onClick={e => e.stopPropagation()}>
                <div className='modal-header'>
                  <button className='modal-close' onClick={onClose}>
                    <FontAwesomeIcon icon={faXmark} className='iconHuy' />
                  </button>
                </div>
                {children}
              </div>
            ) : (
              <Draggable handle='.modal-header'>
                <div
                  className='modal-content'
                  onClick={e => e.stopPropagation()}
                >
                  <div className='modal-header'>
                    <button className='modal-close' onClick={onClose}>
                      <FontAwesomeIcon icon={faXmark} className='iconHuy' />
                    </button>
                  </div>
                  {children}
                </div>
              </Draggable>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}

export default Modal
