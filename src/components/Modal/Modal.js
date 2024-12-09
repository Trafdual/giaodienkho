import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import Draggable from 'react-draggable'
import './Modal.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

const Modal = ({ isOpen, onClose, children }) => {
  

  // Kiểm tra kích thước màn hình
  const [isMobile, setIsMobile] = useState(false)

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
  
if (!isOpen) return null

  return ReactDOM.createPortal(
    <div className='modal-overlay'>
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
        <Draggable handle='modal-header'>
          <div className='modal-content' onClick={e => e.stopPropagation()}>
            <div className='modal-header'>
              <button className='modal-close' onClick={onClose}>
                <FontAwesomeIcon icon={faXmark} className='iconHuy' />
              </button>
            </div>
            {children}
          </div>
        </Draggable>
      )}
    </div>,
    document.body
  )
}

export default Modal
