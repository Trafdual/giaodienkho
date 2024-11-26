/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import './DetailData.scss'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'
import axios from 'axios'
import OtherStoreModal from './ModalOtherStore/OtherStoreModal'
function ModalDataScreen ({
  isOpen,
  onClose,
  userId,
  product,
  onItemsSelected
}) {
  const [data, setData] = useState([])
  const [selectedSizes, setSelectedSizes] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  //đang sửa
  const [selectedProductName, setSelectedProductName] = useState({})
  const [selectedProductmaSKU, setSelectedProductmaSKU] = useState({})


  const [selectedProducts, setSelectedProducts] = useState([])
  const khoId1 = localStorage.getItem('khoIDBH') || ''
  const [selectedProductsBySku, setSelectedProductsBySku] = useState({})
  const [isOtherStoreModalOpen, setOtherStoreModalOpen] = useState(false)
  const [selectedStores, setSelectedStores] = useState([])

  const handleViewOtherStores = (stores, tensp,masku) => {
    setSelectedStores(stores)
    setSelectedProductName(tensp) // Lưu tên sản phẩm
    setOtherStoreModalOpen(true)
    setSelectedProductmaSKU(masku)
  }

  useEffect(() => {
    if (isOpen) {
      axios
        .get(
          `https://www.ansuataohanoi.com/banhang/${product._id}/${khoId1}/${userId}`
        )
        .then(response => {
          setData(response.data)

          // Khôi phục danh sách đã chọn cho sản phẩm mới (nếu có)
          setSelectedProducts(selectedProductsBySku[product._id] || [])
        })
        .catch(error => {
          console.error('Error fetching data:', error)
        })
    }

    return () => {
      setSelectedProductsBySku(prevState => {
        const currentSelection = prevState[product._id] || []
        // Chỉ cập nhật nếu danh sách thực sự thay đổi
        if (
          selectedProducts.length !== currentSelection.length ||
          !selectedProducts.every(item => currentSelection.includes(item))
        ) {
          return {
            ...prevState,
            [product._id]: selectedProducts
          }
        }
        return prevState
      })
    }
  }, [isOpen, product._id, userId])

  const handleSizeSelect = size => {
    if (size === 'all') {
      setSelectAll(!selectAll)
      if (!selectAll) {
        setSelectedSizes(data.map(item => item.name))
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

  const handleProductSelect = item => {
    setSelectedProducts(prevState =>
      prevState.includes(item.idsku)
        ? prevState.filter(productId => productId !== item.idsku)
        : [...prevState, item.idsku]
    )

    setSelectedProductsBySku(prevState => {
      const currentProductSkus = prevState[product._id] || [] // Lấy danh sách hiện tại của product._id
      const updatedSkus = currentProductSkus.includes(item.idsku)
        ? currentProductSkus.filter(sku => sku !== item.idsku) // Nếu SKU đã chọn, loại bỏ
        : [...currentProductSkus, item.idsku] // Nếu chưa chọn, thêm vào

      return {
        ...prevState,
        [product._id]: updatedSkus
      }
    })
  }

  const filteredItems = selectAll
    ? data
    : data.filter(item => selectedSizes.includes(item.name))

  const handleAgree = () => {
    const selectedItems = data.filter(item =>
      selectedProducts.includes(item.idsku)
    )
    onItemsSelected(selectedItems)
    onClose()
  }

  const ModalBanhang = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null
    return (
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
      </div>
    )
  }
  console.log(data)
  return (
    <>
      <OtherStoreModal
        isOpen={isOtherStoreModalOpen}
        onClose={() => setOtherStoreModalOpen(false)}
        stores={selectedStores}
        productName={selectedProductName}
        masku={selectedProductmaSKU}
      />
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
                          if (
                            selectedProducts.length === filteredItems.length
                          ) {
                            setSelectedProducts([]) // Bỏ chọn tất cả
                          } else {
                            setSelectedProducts(
                              filteredItems.map(item => item.idsku)
                            )
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
                          <span
                            className='tooltip-target-wrapper clickable'
                            onClick={() =>
                              handleViewOtherStores(item.cacKhoKhac, item.tensp,item.masku)
                            }
                          >
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
    </>
  )
}

export default ModalDataScreen
