/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import './DetailData.scss'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'
import axios from 'axios'

function ModalDataScreen ({
  isOpen,
  onClose,
  userId,
  product,
  onItemsSelected
}) {
  const [data, setData] = useState([]) // Dữ liệu sản phẩm
  const [selectedSizes, setSelectedSizes] = useState([]) // Kích thước đã chọn
  const [selectAll, setSelectAll] = useState(false) // Chức năng chọn tất cả
  const [selectedProducts, setSelectedProducts] = useState([]) // Các sản phẩm đã chọn
  const khoId1 = localStorage.getItem('khoIDBH') || ''
  useEffect(() => {
    if (isOpen) {
      axios
        .get(
          `https://www.ansuataohanoi.com/banhang/${product._id}/${khoId1}/${userId}`
        )
        .then(response => {
          setData(response.data)
          console.log(response.data)
        })
        .catch(error => {
          console.error('Error fetching data:', error)
        })
    }
  }, [isOpen, product._id, userId])

  // Hàm xử lý chọn kích thước
  const handleSizeSelect = size => {
    if (size === 'all') {
      setSelectAll(!selectAll) // Toggle "Chọn tất cả"
      if (!selectAll) {
        setSelectedSizes(data.map(item => item.name)) // Chọn tất cả kích thước
      } else {
        setSelectedSizes([]) // Bỏ chọn tất cả
      }
    } else {
      setSelectAll(false)
      setSelectedSizes(
        prevSelected =>
          prevSelected.includes(size)
            ? prevSelected.filter(s => s !== size) // Bỏ chọn
            : [...prevSelected, size] // Chọn
      )
    }
  }

  const isSizeSelected = size =>
    selectAll ? true : selectedSizes.includes(size)

  // Hàm xử lý chọn sản phẩm
  const handleProductSelect = item => {
    const isSelected = selectedProducts.includes(item.idsku)
    if (isSelected) {
      setSelectedProducts(
        selectedProducts.filter(productId => productId !== item.idsku)
      ) // Bỏ chọn
    } else {
      setSelectedProducts([...selectedProducts, item.idsku]) // Chọn sản phẩm
    }
  }

  const filteredItems = selectAll
    ? data
    : data.filter(item => selectedSizes.includes(item.name))

  // Hàm khi bấm "Đồng ý" để gửi dữ liệu đã chọn
  const handleAgree = () => {
    const selectedItems = data.filter(item =>
      selectedProducts.includes(item.idsku)
    )
    onItemsSelected(selectedItems) // Pass selected items back to parent
    onClose() // Close the modal
  }

  const ModalBanhang = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null
    return ReactDOM.createPortal(
      <div className='modal-overlay-banhang' onClick={onClose}>
        <div
          className='modal-content-banhang'
          onClick={e => e.stopPropagation()}
        >
          <button className='modal-close' onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
          {children}
        </div>
      </div>,
      document.body
    )
  }

  return (
    <ModalBanhang isOpen={isOpen} onClose={onClose}>
      <div className='modal-header'>
        <img
          src='https://png.pngtree.com/png-clipart/20220125/original/pngtree-illustration-vector-design-of-shop-market-png-image_7224159.png'
          alt='Product'
          className='product-icon'
        />
        <div>
          <h2>Chi tiết sản phẩm</h2>
          <p>Kho hiện tại: {data[0]?.tenkhohientai || 'Chưa có thông tin'}</p>
        </div>
      </div>

      <div className='modal-body'>
        <div className='size-selector'>
          <button
            onClick={() => handleSizeSelect('all')}
            className={`size-btn ${selectAll ? 'selected1' : ''}`}
          >
            Tất cả
          </button>
          {data.map(item => (
            <button
              key={item.name}
              onClick={() => handleSizeSelect(item.name)}
              className={`size-btn ${
                isSizeSelected(item.name) ? 'selected1' : ''
              }`}
            >
              {item.name} ({item.tonkho})
            </button>
          ))}
        </div>

        <div className='table-container'>
          {filteredItems.length === 0 ? (
            <div className='no-selection-message'>
              <img
                src='https://png.pngtree.com/png-clipart/20230807/original/pngtree-cartoon-illustration-of-a-man-carrying-a-heavy-box-while-walking-created-using-vector-handdrawn-technique-vector-picture-image_10079648.png'
                alt='No selection'
                className='no-selection-image'
              />
              <p>Vui lòng chọn hàng hóa và kích thước</p>
            </div>
          ) : (
            <table className='modal-table'>
              <thead>
                <tr>
                  <th>
                    <input
                      type='checkbox'
                      checked={filteredItems.every(item =>
                        selectedProducts.includes(item.idsku)
                      )}
                      onChange={() => {
                        if (selectedProducts.length === filteredItems.length) {
                          setSelectedProducts([]) // Bỏ chọn tất cả
                        } else {
                          setSelectedProducts(
                            filteredItems.map(item => item.idsku)
                          ) // Chọn tất cả sản phẩm
                        }
                      }}
                    />
                  </th>
                  <th>Tên sản phẩm</th>
                  <th>Tồn kho</th>
                  <th>Tồn kho khác</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map(item => (
                  <tr key={item.idsku}>
                    <td>
                      <input
                        type='checkbox'
                        checked={selectedProducts.includes(item.idsku)}
                        onChange={() => handleProductSelect(item)} // Chọn lẻ sản phẩm
                      />
                    </td>
                    <td>{item.tensp}</td>
                    <td>{item.tonkho}</td>
                    <td>
                      <Tippy
                        content={
                          <div>
                            {item.cacKhoKhac.map(store => (
                              <div key={store.khoId}>
                                {store.tenkho}: {store.soluong} chiếc
                              </div>
                            ))}
                          </div>
                        }
                        placement='bottom'
                      >
                        <span className='tooltip-target-wrapper'>
                          {item.tongSoLuongCacKhoKhac}
                        </span>
                      </Tippy>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className='modal-footer'>
        <button className='agree-btn' onClick={handleAgree}>
          Đồng ý
        </button>
        <button className='close-btn' onClick={onClose}>
          Đóng
        </button>
      </div>
    </ModalBanhang>
  )
}

export default ModalDataScreen
