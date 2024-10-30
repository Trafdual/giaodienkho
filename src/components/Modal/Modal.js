import React from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';
import './Modal.scss'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
<<<<<<< HEAD
    <div className="modal-overlay" onClick={onClose}>
      {/* Bọc modal-content với Draggable */}
      <Draggable handle=".modal-header">
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <button className="modal-close" onClick={onClose}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
          {children}
        </div>
      </Draggable>
=======
    <div className="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <FontAwesomeIcon icon={faXmark}/>
        </button>
        {children}
      </div>
>>>>>>> 337580cbb7d89fe31c38c842b61b64b09fa48532
    </div>,
    document.body
  );
};

export default Modal;
