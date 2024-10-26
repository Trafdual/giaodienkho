import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import './DetailData.scss';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

function ModalDataScreen({ isOpen, onClose }) {
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
        size: 128,
        sku: '1102-128',
        barcode: '100128',
        name: '12PRM MỚI (128)',
        unit: 'Chiếc',
        price: 1000,
        otherStores: 2,
        stock: 10,
        quantity: 1,
        storeDetails: [
          { name: 'Cửa hàng A', quantity: 1 },
          { name: 'Cửa hàng B', quantity: 1 },
        ],
      },
      
      {
        size: 256,
        sku: '1102-256',
        barcode: '100154',
        name: '12PRM MỚI (256)',
        unit: 'Chiếc',
        price: 2000,
        otherStores: 3,
        stock: 5,
        quantity: 1,
        storeDetails: [
          { name: 'Cửa hàng A', quantity: 2 },
          { name: 'Cửa hàng B', quantity: 1 },
        ],
      },
      {
        size: 512,
        sku: '1102-512',
        barcode: '100512',
        name: '12PRM MỚI (512)',
        unit: 'Chiếc',
        price: 3000,
        otherStores: 1,
        stock: 0,
        quantity: 0,
        storeDetails: [
          { name: 'Cửa hàng C', quantity: 1 },
        ],
      },
    ],
  };

  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleSizeSelect = (size) => {
    if (size === "all") {
      if (selectAll) {
        setSelectAll(false);
        setSelectedSizes([]); // Bỏ chọn tất cả
      } else {
        setSelectAll(true);
        setSelectedSizes(data.sizes.map((s) => s.size)); // Chọn tất cả kích thước
      }
    } else {
      setSelectAll(false); // Bỏ chọn "Tất cả" khi chọn một kích thước cụ thể
      
      setSelectedSizes((prevSelected) =>
        prevSelected.includes(size)
          ? prevSelected.filter((s) => s !== size) // Bỏ chọn nếu đã chọn
          : [...prevSelected, size] // Thêm vào danh sách đã chọn
      );
    }
  };

  const isSizeSelected = (size) => 
    selectAll ? false : selectedSizes.includes(size); 

  const filteredItems = selectAll
    ? data.items
    : data.items.filter((item) => selectedSizes.includes(item.size));

  const ModalBanhang = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
      <div className="modal-overlay-banhang" onClick={onClose}>
        <div className="modal-content-banhang" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
          {children}
        </div>
      </div>,
      document.body
    );
  };

  return (
    <ModalBanhang isOpen={isOpen} onClose={onClose}>
      <div className="modal-header">
        <img
          src="https://png.pngtree.com/png-clipart/20220125/original/pngtree-illustration-vector-design-of-shop-market-png-image_7224159.png"
          alt="Product"
          className="product-icon"
        />
        <div>
          <h2>{data.title}</h2>
          <p>Vị trí lưu kho: {data.location}</p>
          <p>Vị trí trưng bày: {data.displayPosition}</p>
        </div>
      </div>

      <div className="modal-body">
        <div className="size-selector">
          <button
            onClick={() => handleSizeSelect("all")}
            className={`size-btn ${selectAll ? 'selected1' : ''}`}
          >
            Tất cả
          </button>
          {data.sizes.map((size) => (
            <button
              key={size.size}
              onClick={() => handleSizeSelect(size.size)}
              className={`size-btn ${isSizeSelected(size.size) ? 'selected1' : ''}`}
            >
              {size.size} ({size.available})
            </button>
          ))}
        </div>

        <div className="table-container">
          {filteredItems.length === 0 ? (
            <div className="no-selection-message">
              <img src="https://png.pngtree.com/png-clipart/20230807/original/pngtree-cartoon-illustration-of-a-man-carrying-a-heavy-box-while-walking-created-using-vector-handdrawn-technique-vector-picture-image_10079648.png" alt="No selection" className="no-selection-image" />
              <p>Vui lòng chọn hàng hóa và kích thước</p>
            </div>
          ) : (
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
                {filteredItems.map((item) => (
                  <tr key={item.sku}>
                    <td>{item.sku}</td>
                    <td>{item.barcode}</td>
                    <td>{item.name}</td>
                    <td>{item.unit}</td>
                    <td>{item.price}</td>
                    <td>
                      <Tippy
                        content={
                          <div>
                            {item.storeDetails.map((store) => (
                              <div key={store.name}>
                                {store.name}: {store.quantity} chiếc
                              </div>
                            ))}
                          </div>
                        }
                        placement="bottom"
                      >
                        <span className="tooltip-target-wrapper">{item.otherStores}</span>
                      </Tippy>
                    </td>
                    <td>{item.quantity}</td>
                    <td>{item.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
     
      </div>

      <div className="modal-footer">
        <button className="agree-btn">Đồng ý</button>
        <button className="close-btn" onClick={onClose}>
          Đóng
        </button>
      </div>
    </ModalBanhang>
  );
}

export default ModalDataScreen;
