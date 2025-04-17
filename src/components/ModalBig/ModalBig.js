import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import './ModalBig.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import Draggable from 'react-draggable'
import { motion, AnimatePresence } from 'framer-motion'

const ModalBig = ({ isOpen, onClose, children }) => {
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
      setIsMobile(window.innerWidth <= 768)
    }

    window.addEventListener('resize', handleResize)

    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className='ModalBig-overlay'>
          {isMobile ? (
            <motion.div
              className='ModalBig-content'
              initial={{ opacity: 0, scale: 0.8, y: '-50%' }}
              animate={{ opacity: 1, scale: 1, y: '0%' }}
              exit={{ opacity: 0, scale: 0.8, y: '-50%' }}
              transition={{ duration: 0.3 }}
              onClick={e => e.stopPropagation()}
            >
              <div className='modal-header'>
                <button className='ModalBig-close' onClick={onClose}>
                  <FontAwesomeIcon icon={faXmark} className='iconHuy' />
                </button>
              </div>
              {children}
            </motion.div>
          ) : (
            <Draggable handle='.modal-header'>
              <motion.div
                className='ModalBig-content'
                initial={{ opacity: 0, scale: 0.8, y: '-50%' }}
                animate={{ opacity: 1, scale: 1, y: '0%' }}
                exit={{ opacity: 0, scale: 0.8, y: '-50%' }}
                transition={{ duration: 0.3 }}
                onClick={e => e.stopPropagation()}
              >
                <div className='modal-header'>
                  <button className='ModalBig-close' onClick={onClose}>
                    <FontAwesomeIcon icon={faXmark} className='iconHuy' />
                  </button>
                </div>
                {children}
              </motion.div>
            </Draggable>
          )}
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}

export default ModalBig
