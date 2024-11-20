import React, { useEffect, useState } from 'react';
import './Banhang.scss';
import axios from 'axios';
import { FaBell, FaUser, FaBarcode, FaShoppingCart, FaUserTag } from "react-icons/fa";
import { MdSearch } from "react-icons/md";
import ModalDataScreen from './DetailData';
import HeaderBanHang from '../BanHangLayout/HeaderBanHang/HeaderBanHang';
import { getFromLocalStorage } from '~/components/MaHoaLocalStorage/MaHoaLocalStorage';
function BanHangLayout() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [imeiList, setImeiList] = useState([]);
  const [selectedSku, setSelectedSku] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState([]); // Danh sách sản phẩm từ API
  const [selectedProduct, setSelectedProduct] = useState(null); // Sản phẩm được chọn
  const [selectedItems, setSelectedItems] = useState([]);
  const handleItemsSelected = (items) => {
    setSelectedItems(items);
  };
  // Lấy userId và khoId từ localStorage
  const userId = getFromLocalStorage('userId') || '';
  const idkho1 = localStorage.getItem('khoIDBH');
  console.log("Dữ liệu kho id", idkho1);

  const handleOpenModal = async (idSku) => {
    try {
      // Gọi API để lấy dữ liệu
      const response = await axios.get(
        `https://www.ansuataohanoi.com/getsanphamchon/${idkho1}/${idSku}`
      );
  
      const data = response.data; // Dữ liệu trả về từ API
      console.log("Dữ liệu IMEI từ API:", data);
  
      if (Array.isArray(data)) {
        // Đảm bảo dữ liệu là một mảng
        setImeiList(data);
      } else {
        console.warn("Dữ liệu không phải là một mảng:", data);
        setImeiList([]); // Đặt danh sách IMEI rỗng nếu không hợp lệ
      }
  
      setModalOpen(true); // Mở modal
      setSelectedSku(idSku); // Lưu SKU đang chọn
    } catch (error) {
      console.error("Lỗi khi gọi API lấy danh sách IMEI:", error);
      setImeiList([]); // Đặt danh sách IMEI rỗng khi gặp lỗi
    }
  };
  
  const handleCloseModal = () => {
    setModalOpen(false);
    setImeiList([]);
    setSelectedSku(null);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      if (!userId) return; // Nếu thiếu userId hoặc khoId, không gọi API
      try {
        const response = await axios.get(`https://www.ansuataohanoi.com/getspbanhang/${userId}`);
        setProducts(response.data); // Giả sử API trả về danh sách sản phẩm
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      }
    };

    fetchProducts();
  }, [userId]);

  // Xử lý khi bấm vào sản phẩm
  const handleProductClick = (product) => {
    setSelectedProduct(product); // Lưu sản phẩm được chọn
    setIsOpen(true); // Mở modal
  };
  const handleRemove = (id) => {
    setSelectedItems(selectedItems.filter((item) => item.idsku !== id));
  };
  return (
    <div className="app-container">
      <HeaderBanHang userId={userId} />

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
            </div>
            <div className="selected-products-container">
              <h3>Danh sách sản phẩm đã chọn:</h3>
              <table className="product-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>SKU</th>
                    <th>Hàng hóa</th>
                    <th>SL</th>
                    <th>ĐVT</th>
                    <th>Đơn giá</th>
                    <th>Thành tiền</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {selectedItems.map((item, index) => (
                    <tr key={item.idsku}>
                      <td>{index + 1}</td>
                      <td>{item.idsku}</td>
                      <td>
                {item.tensp}
                <button
                  className="select-serial-btn"
                  onClick={() => handleOpenModal( item.idsku)}
                >
                  Chọn Serial/IMEI
                </button>
              </td>
                      <td>{item.soluong}</td>
                      <td>{item.dvt}</td>
                      <td>222</td>
                      <td>222</td>
                      <td>
                        <button
                          className="remove-btn"
                          onClick={() => handleRemove(item.idsku)}
                        >
                          X
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>

          </div>

          <div className="prd">
            <div>
              <h3>Danh sách sản phẩm</h3>
            </div>
            <div className="product-grid">
              {products.length > 0 ? (
                products.map((product, index) => (
                  <div
                    key={index}
                    className="product-card"
                    onClick={() => handleProductClick(product)}
                  >
                    {product.name}
                  </div>
                ))
              ) : (
                <p>Không có sản phẩm nào.</p>
              )}
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

      {selectedProduct && (
        <ModalDataScreen
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          product={selectedProduct}
          userId={userId}
          onItemsSelected={handleItemsSelected}
        />
      )}
    {isModalOpen && (
  <div className="modal1">
    <div className="modal-content1">
      <h4>Danh sách Serial/IMEI cho SKU: {selectedSku}</h4>
      {imeiList.length > 0 ? (
        <ul>
          {imeiList.map((imei, index) => (
            <li key={index}>{imei.imel || "Không có thông tin IMEI"}</li>
          ))}
        </ul>
      ) : (
        <p>Không có dữ liệu IMEI hoặc đang tải...</p>
      )}
      <button className="close-btn" onClick={handleCloseModal}>
        Đóng
      </button>
    </div>
  </div>
)}

    </div>
  );
}

export default BanHangLayout;
