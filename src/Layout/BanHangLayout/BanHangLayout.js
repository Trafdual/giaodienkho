import React, { useState } from 'react';
import './Banhang.scss';
import { FaBell, FaUser, FaBarcode, FaShoppingCart, FaUserTag } from "react-icons/fa";
import { MdSearch } from "react-icons/md";
import ModalDataScreen from './modalsp';

function BanHangLayout() {
  const [isOpen, setIsOpen] = useState(false)

  const products = [
    '13 TRUNG BÀY (128)',
    'màn 11 prm zin',
    '12PRM MỚI',
    '15 PRM 1T',
    'XS',
    'Củ sạc nhanh',
  ];

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo-section">
          <FaShoppingCart className="logo-icon" />
          <span>Hóa đơn 1</span>
        </div>
        <div className="header-actions">
          <button className="save-draft-btn">HĐ lưu tạm</button>
        </div>
        <div className="header-right">
          <span className="store-name">9 Mobile</span>
          <FaBell className="iconbanhang" />
          <FaUser className="iconbanhang" />
        </div>
      </header>

      <div className="row">
        <div className="column left-column">
          <div className="head">
            <div className="search-bar-section">
              <div className="search-bar">
                <label>Tìm kiếm</label>
                <input
                  type="text"
                  placeholder="(F3) Nhập tên hàng hóa, mã vạch, mã SKU"
                  className="search-input"
                />
                <MdSearch className="search-icon" />
                <input type="number" value="1" className="quantity-input" />
                <FaBarcode className="barcode-icon" />
                <FaUser className="staff-icon" />
                <FaUserTag className="price-tag-icon" />
              </div>
              <div className="search-options">
                <button className="search-option-btn">Chọn hàng hóa</button>
                <button className="search-option-btn">Nhập khẩu hàng hóa</button>
              </div>
            </div>

            <div className="empty-product-message">
              <img
                src="https://png.pngtree.com/png-vector/20240309/ourlarge/pngtree-tea-shop-sale-vector-concept-black-illustration-png-image_11902973.png"
                alt="No Products"
                className="empty-product-img"
              />
              <p>Chưa có hàng hóa nào, ấn F3 để tìm kiếm hàng hóa</p>
              <button className="choose-product-btn">Chọn hàng hóa</button>
              <button className="import-product-btn">Nhập khẩu hàng hóa</button>
            </div>
          </div>

          <div className="prd">
            <div>
              <h3>Danh sách sản phẩm</h3>
            </div>
            <div className="product-grid">
              {products.map((product, index) => (
                <div key={index} className="product-card" onClick={() => setIsOpen(true)}>
                  {product}

                </div>
              ))}


            </div>
          </div>
        </div>

        <div className="checkout-section">
          <div className="checkout-header">
            <span>22/10/2024 - 15:22</span>
            <button className="store-btn">Tại cửa hàng</button>
          </div>

          <div className="customer-info">
            <div className="customer-input-section">
              <MdSearch className="iconbanhang" />
              <input type="text" placeholder="(F4) SĐT, tên khách hàng" className="customer-input" />
              <FaBarcode className="iconbanhang" />
              <FaShoppingCart className="iconbanhang" />
            </div>
          </div>

          <div className="checkout-summary">
            <div className="summary-item">
              <span>Tổng tiền</span>
              <span>0</span>
            </div>
            <div className="summary-item">
              <span>Đặt cọc</span>
              <span>0</span>
            </div>
            <div className="summary-item">
              <span>Còn phải thu</span>
              <span>0</span>
            </div>

            <div className="payment-method">
              <span>Tiền mặt</span>
              <span>0</span>
            </div>

            <div className="summary-item">
              <span>Trả lại khách</span>
              <span>0</span>
            </div>
          </div>

          <div className="additional-options">
            <label>
              <input type="checkbox" />
              Tính vào công nợ
            </label>
            <input type="text" placeholder="Ghi chú ..." className="notes-input" />
          </div>

          <div className="cash-suggestions">
            <button>500.000</button>
            <button>200.000</button>
            <button>100.000</button>
          </div>

          <div className="checkout-actions">
            <button className="save-btn">Lưu tạm (F10)</button>
            <button className="pay-btn">Thu tiền (F9)</button>
          </div>
        </div>
      </div>
      <ModalDataScreen
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}

export default BanHangLayout;
