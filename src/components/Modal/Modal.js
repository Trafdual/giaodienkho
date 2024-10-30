import React from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';
import './Modal.scss'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
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
    </div>,
    document.body
  );
};

export default Modal;
