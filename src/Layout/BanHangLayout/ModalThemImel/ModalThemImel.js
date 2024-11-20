import React from "react";
import ReactDOM from "react-dom";
import Draggable from "react-draggable";
import "./ModalThemImel.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faSyncAlt } from "@fortawesome/free-solid-svg-icons";

const ModalThemImel = ({ isOpen, onClose, onConfirm, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="ModalThemImel-overlay">
      <Draggable handle=".ModalThemImel-header">
        <div className="ModalThemImel-content" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="ModalThemImel-header">
            <h3 className="ModalThemImel-title">
              Serial/IMEI
              <FontAwesomeIcon icon={faSyncAlt} className="ModalThemImel-refresh" />
            </h3>
            <button className="ModalThemImel-close" onClick={onClose}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>

          {/* Body */}
          <div className="ModalThemImel-body">
            <div className="ModalThemImel-info">
              <span>XS (256) (0/1)</span>
            </div>
            <div className="ModalThemImel-search">
              <input type="text" placeholder="Tìm serial/IMEI..." />
            </div>
            <div className="ModalThemImel-list">
              {children }
            </div>
          </div>

          {/* Footer */}
          <div className="ModalThemImel-footer">
            <button className="ModalThemImel-confirm" onClick={onConfirm}>
              Đồng ý
            </button>
            <button className="ModalThemImel-cancel" onClick={onClose}>
              Đóng
            </button>
          </div>
        </div>
      </Draggable>
    </div>,
    document.body
  );
};

export default ModalThemImel;
