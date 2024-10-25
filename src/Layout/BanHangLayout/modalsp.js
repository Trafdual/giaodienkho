import React, { useState } from 'react';
import { Modal } from '../../components/Modal'
import './ModalData.scss'; 

function ModalDataScreen ({ isOpen, onClose})  {
  const data = {
    title: '12PRM MỚI',
    location: 'Chưa có thông tin',
    displayPosition: 'Chưa có thông tin',
    sizes: [
      { size: 128, available: 3 },
      { size: 256, available: 1 },
      { size: 512, available: 0 },
    ],
    items: [
      {
        sku: '1102-256',
        barcode: '100154',
        name: '12PRM MỚI (256)',
        unit: 'Chiếc',
        price: 0,
        otherStores: 3,
        stock: 2,
        quantity: 1,
      },
    ],
  };
  const handleClose = () => {
    onClose()
  }
  return (
  
    
      <Modal isOpen={isOpen} onClose={handleClose}>
        <div className="modal-header">
          <img src="https://png.pngtree.com/png-clipart/20220125/original/pngtree-illustration-vector-design-of-shop-market-png-image_7224159.png" alt="Product" className="product-icon" />
          <div>
            <h2>{data.title}</h2>
            <p>Vị trí lưu kho: {data.location}</p>
            <p>Vị trí trưng bày: {data.displayPosition}</p>
          </div>
        </div>

        <div className="modal-body">
          <div className="size-selector">
            {data.sizes.map((size) => (
              <button key={size.size} className={`size-btn ${size.available > 0 ? 'available' : ''}`}>
                {size.size} ({size.available})
              </button>
            ))}
          </div>

          <table className="modal-table">
            <thead>
              <tr>
                <th>Mã SKU</th>
                <th>Mã vạch</th>
                <th>Tên hàng hóa</th>
                <th>ĐVT</th>
                <th>Giá</th>
                <th>Tồn cửa hàng khác</th>
                <th>SL</th>
                <th>Tồn kho</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item) => (
                <tr key={item.sku}>
                  <td>{item.sku}</td>
                  <td>{item.barcode}</td>
                  <td>{item.name}</td>
                  <td>{item.unit}</td>
                  <td>{item.price}</td>
                  <td>{item.otherStores}</td>
                  <td>{item.quantity}</td>
                  <td>{item.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="modal-footer">
          <button className="agree-btn">Đồng ý</button>
          <button className="close-btn" onClick={handleClose}>
            Đóng
          </button>
        </div>
      </Modal>
 
  );
};

export default ModalDataScreen;
