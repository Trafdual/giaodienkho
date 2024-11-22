import React, { useState } from "react";
import ReactDOM from "react-dom";
import Draggable from "react-draggable";
import "./ModalThemImel.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faSyncAlt } from "@fortawesome/free-solid-svg-icons";

const ModalThemImel = ({ isOpen, onClose, imeiList, onConfirm, allSelectedImeis }) => {
  const [selectedImeis, setSelectedImeis] = useState([]);

  if (!isOpen) return null;

  const handleCheckboxChange = (e, imei) => {
    if (e.target.checked) {
      setSelectedImeis((prev) => [...prev, imei]);
    } else {
      setSelectedImeis((prev) => prev.filter((imel) => imel !== imei));
    }
  };

  const handleConfirm = () => {
    onConfirm(selectedImeis);
    onClose(); // Đóng modal sau khi chọn
    setSelectedImeis([]);
  };
  const filteredImeis = imeiList.filter(
    (imei) => !allSelectedImeis.includes(imei.imel) // Loại bỏ IMEI đã chọn
  );


  return ReactDOM.createPortal(
    <div className="ModalThemImel-overlay" onClick={onClose}>
      <Draggable handle=".ModalThemImel-header">
        <div
          className="ModalThemImel-content"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="ModalThemImel-header">
            <h3 className="ModalThemImel-title">
              Serial/IMEI
              <FontAwesomeIcon icon={faSyncAlt} className="ModalThemImel-refresh" />
            </h3>
            <button className="ModalThemImel-close" onClick={onClose}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>

          <div className="ModalThemImel-body">
            <div className="ModalThemImel-list">
              <ul>
                {filteredImeis.map((imei, index) => (
                  <li key={index}>
                    <label>
                      <input
                        type="checkbox"
                        value={imei.imel}
                        onChange={(e) => handleCheckboxChange(e, imei.imel)}
                      />
                      {typeof imei.imel === "string" || typeof imei.imel === "number"
                        ? imei.imel
                        : JSON.stringify(imei.imel) || "Không có thông tin IMEI"}
                    </label>
                  </li>
                ))}
              </ul>

            </div>

          </div>

          <div className="ModalThemImel-footer">
            <button className="ModalThemImel-confirm" onClick={handleConfirm}>
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
