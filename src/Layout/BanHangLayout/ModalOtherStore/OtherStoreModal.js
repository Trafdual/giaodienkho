import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import TransferRequestModal from "../TransferRequestModal/TransferRequestModal"; 
import "./OtherStoreModal.scss";

function OtherStoreModal({ isOpen, onClose, stores }) {
  const [selectedStore, setSelectedStore] = useState(null); // Lưu dữ liệu chuyển sang modal mới
  const [isTransferModalOpen, setTransferModalOpen] = useState(false); // Trạng thái modal mới
  const [selectedProductName, setSelectedProductName] = useState("");
  const handleRequestTransfer = (store, tensp) => {
    setSelectedStore(store); // Lưu thông tin sản phẩm/kho
    setSelectedProductName(tensp); // Lưu tên sản phẩm
    setTransferModalOpen(true); // Mở modal mới
  };

  const handleCloseTransferModal = () => {
    setTransferModalOpen(false); // Đóng modal mới
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay-banhang12" onClick={onClose}>
        <div
          className="modal-content-banhang12"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="modal-close" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
          <h2>Tồn cửa hàng khác</h2>
          <input
            type="text"
            placeholder="Nhập tên chi nhánh, địa chỉ"
            className="search-input-otherstore"
          />
          <div className="store-list">
            {stores.map((store) => (
              <div key={store.khoId} className="store-item">
                <div>
                  <strong>{store.tenkho}</strong> <span>: {store.soluong}</span>
                </div>
                <button
                  className="request-transfer-btn"
                  onClick={() => handleRequestTransfer(store)}
                >
                  YC điều chuyển
                </button>
              </div>
            ))}
          </div>
          <div className="modal-footer-otherstore">
            <button className="close-btn" onClick={onClose}>
              Đóng
            </button>
          </div>
        </div>
      </div>

      {isTransferModalOpen && (
        <TransferRequestModal
        isOpen={isTransferModalOpen}
        onClose={handleCloseTransferModal}
        store={selectedStore} // Truyền sản phẩm
      />
      )}
    </>
  );
}

export default OtherStoreModal;
