import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import TransferRequestModal from '../TransferRequestModal/TransferRequestModal'
import { useToast } from '~/components/GlobalStyles/ToastContext'
import './OtherStoreModal.scss'

function OtherStoreModal ({ isOpen, onClose, stores, productName, masku, idsku }) {
  const [selectedStore, setSelectedStore] = useState(null)
  const [isTransferModalOpen, setTransferModalOpen] = useState(false)
  const { showToast } = useToast()
  const handleRequestTransfer = store => {
    if (store.soluong === 0) {
      showToast('Không có sản phẩm nào ở kho bạn chọn', 'warning')
    } else {
      setSelectedStore(store)
      setTransferModalOpen(true)
    }
  }

  const handleCloseTransferModal = () => {
    setTransferModalOpen(false)
  }

  if (!isOpen) return null

  return (
    <>
      <div className='modal-overlay-banhang12' onClick={onClose}>
        <div
          className='modal-content-banhang12'
          onClick={e => e.stopPropagation()}
        >
          <button className='modal-close' onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
          <h2>Tồn cửa hàng khác</h2>
          <input
            type='text'
            placeholder='Nhập tên chi nhánh, địa chỉ'
            className='search-input-otherstore'
          />
          <div className='store-list'>
            {stores.map(store => (
              <div key={store.khoId} className='store-item'>
                <div>
                  <strong>{store.tenkho}</strong> <span>: {store.soluong}</span>
                </div>
                <button
                  className='request-transfer-btn'
                  onClick={() => handleRequestTransfer(store)}
                >
                  YC điều chuyển
                </button>
              </div>
            ))}
          </div>
          <div className='modal-footer-otherstore'>
            <button className='close-btn' onClick={onClose}>
              Đóng
            </button>
          </div>
        </div>
      </div>

      {isTransferModalOpen && (
        <TransferRequestModal
          isOpen={isTransferModalOpen}
          onClose={handleCloseTransferModal}
          store={selectedStore}
          productName={productName}
          idsku={idsku}
          masku={masku}
        />
      )}
    </>
  )
}

export default OtherStoreModal
