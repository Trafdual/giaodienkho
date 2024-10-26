import React from 'react'
import ReactDOM from 'react-dom'
import './ModalBig.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

const ModalBig = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null

  return ReactDOM.createPortal(
    <div className='ModalBig-overlay' onClick={onClose}>
      <div className='ModalBig-content' onClick={e => e.stopPropagation()}>
        <button className='ModalBig-close' onClick={onClose}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
        {children}
      </div>
    </div>,
    document.body
  )
}

export default ModalBig
