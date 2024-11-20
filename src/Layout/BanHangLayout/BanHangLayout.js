import React, { useEffect, useState } from 'react';
import './Banhang.scss';
import axios from 'axios';
import { FaBell, FaUser, FaBarcode, FaShoppingCart, FaUserTag } from "react-icons/fa";
import { MdSearch } from "react-icons/md";
import ModalDataScreen from './DetailData';
import ModalThemImel from '../BanHangLayout/ModalThemImel/ModalThemImel';
import HeaderBanHang from '../BanHangLayout/HeaderBanHang/HeaderBanHang';
import { getFromLocalStorage } from '~/components/MaHoaLocalStorage/MaHoaLocalStorage';



function BanHangLayout() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [imeiList, setImeiList] = useState([]);
  const [selectedSku, setSelectedSku] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [allSelectedImeis, setAllSelectedImeis] = useState([]);

  const handleItemsSelected = (items) => {
    const updatedItems = items.map((item) => ({
      ...item,
      selectedImeis: item.selectedImeis || [], // Khởi tạo mảng rỗng nếu chưa có
    }));
    setSelectedItems(updatedItems);
  };
  // Lấy userId và khoId từ localStorage
  const userId = getFromLocalStorage('userId') || '';
  const idkho1 = localStorage.getItem('khoIDBH');
  console.log("Dữ liệu kho id", idkho1);

  const handleOpenModal = async (idSku) => {
    try {
      const response = await axios.get(
        `https://www.ansuataohanoi.com/getsanphamchon/${idkho1}/${idSku}`
      );
      const data = response.data;
      console.log("Dữ liệu IMEI từ API:", data);

      if (Array.isArray(data)) {
        setImeiList(data);
      } else {
        console.warn("Dữ liệu không phải là một mảng:", data);
        setImeiList([]);
      }

      setModalOpen(true);
      setSelectedSku(idSku);
    } catch (error) {
      console.error("Lỗi khi gọi API lấy danh sách IMEI:", error);
      setImeiList([]);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setImeiList([]);
    setSelectedSku(null);
  };
  const handleImeiConfirm = (selectedImeis) => {
    setSelectedItems((prevItems) =>
      prevItems.map((item) =>
        item.idsku === selectedSku
          ? {
              ...item,
              selectedImeis: selectedImeis || [], // Gán các IMEI đã chọn
              soluong: (selectedImeis || []).length, // Cập nhật số lượng
            }
          : item
      )
    );
  
    // Chỉ thêm các IMEI chưa có trong danh sách allSelectedImeis
    setAllSelectedImeis((prev) => [
      ...prev,
      ...selectedImeis.filter((imei) => !prev.includes(imei)),
    ]);
  };
  
  const handleRemoveImei = (idSku, imeiToRemove) => {
    setSelectedItems((prevItems) =>
      prevItems.map((item) =>
        item.idsku === idSku
          ? {
              ...item,
              selectedImeis: item.selectedImeis.filter((imei) => imei !== imeiToRemove),
              soluong: item.selectedImeis.length - 1, // Cập nhật lại số lượng
            }
          : item
      )
    );
  
    // Xóa IMEI khỏi allSelectedImeis để đảm bảo logic hoạt động đúng
    setAllSelectedImeis((prev) => prev.filter((imei) => imei !== imeiToRemove));
  };
  
  

  useEffect(() => {
    const fetchProducts = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(`https://www.ansuataohanoi.com/getspbanhang/${userId}`);
        setProducts(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      }
    };

    fetchProducts();
  }, [userId]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsOpen(true);
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
                    <React.Fragment key={item.idsku}>
                      <tr>
                        <td>{index + 1}</td>
                        <td>{item.idsku}</td>
                        <td>
  {item.tensp}
  <br />
  <div className="selected-imeis">
    {item.selectedImeis && item.selectedImeis.length > 0 ? (
      item.selectedImeis.map((imei, index) => (
        <button
          key={index}
          className="imei-btn"
          onClick={() => handleRemoveImei(item.idsku, imei)}
        >
          {imei} ✕
        </button>
      ))
    ) : (
      "Chưa chọn IMEI"
    )}
  </div>
  <button
    className="select-serial-btn"
    onClick={() => handleOpenModal(item.idsku)}
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


                    </React.Fragment>
                  ))}
                </tbody>

              </table>
            </div>
          </div>

          <div className="prd">
            <h3>Danh sách sản phẩm</h3>
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
          {/* ... phần nội dung checkout ... */}
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

<ModalThemImel
  isOpen={isModalOpen}
  onClose={handleCloseModal}
  imeiList={imeiList}
  onConfirm={handleImeiConfirm}
  allSelectedImeis={allSelectedImeis} // Truyền danh sách IMEI đã chọn
/>

    </div>
  );
}

export default BanHangLayout;
