/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import './DetailData.scss'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'
import axios from 'axios'
import OtherStoreModal from './ModalOtherStore/OtherStoreModal'
import { useToast } from '~/components/GlobalStyles/ToastContext'
import { getApiUrl } from '../../api/api'
import { ModalBanHang } from './ModalBanHang'

function ModalDataScreen ({
  isOpen,
  onClose,
  userId,
  product,
  onItemsSelected,
  selected
}) {
  const [selectedSize, setSelectedSize] = useState('all')

  const [data, setData] = useState([])
  const [selectedSizes, setSelectedSizes] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const { showToast } = useToast()

  const [selectedProductName, setSelectedProductName] = useState({})
  const [selectedProductmaSKU, setSelectedProductmaSKU] = useState({})
  const [selectedProductidsku, setSelectedProductidsku] = useState({})

  const [selectedProducts, setSelectedProducts] = useState([])
  const khoId1 = localStorage.getItem('khoIDBH') || ''
  const [selectedProductsBySku, setSelectedProductsBySku] = useState({})
  const [isOtherStoreModalOpen, setOtherStoreModalOpen] = useState(false)
  const [selectedStores, setSelectedStores] = useState([])

  const handleViewOtherStores = (stores, tensp, masku, idsku) => {
    setSelectedStores(stores)
    setSelectedProductName(tensp)
    setOtherStoreModalOpen(true)
    setSelectedProductmaSKU(masku)
    setSelectedProductidsku(idsku)
  }

  useEffect(() => {
    console.log('isOpen:', isOpen)
    console.log('product._id:', product._id)
    console.log('userId:', userId)
    if (isOpen && product._id && khoId1 && userId) {
      axios
        .get(
          `${getApiUrl('domain')}/banhang/${product._id}/${khoId1}/${userId}`
        )
        .then(response => {
          setData(response.data)

          setSelectedProducts(selectedProductsBySku[product._id] || [])
        })
        .catch(error => {
          console.error('Error fetching data:', error)
        })
    }

    return () => {
      setSelectedProductsBySku(prevState => {
        const currentSelection = prevState[product._id] || []
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
  }, [isOpen, product._id, userId, khoId1])

  console.log(isOpen)

  const handleSizeSelect = size => {
    if (size === 'all') {
      setSelectedSizes([])
      setSelectedSize('all')
      setSelectAll(!selectAll)
      if (!selectAll) {
        const selectableSizes = data
          .filter(item => item.tonkho > 0)
          .map(item => item.name)

        setSelectedSizes(selectableSizes)
      } else {
        setSelectedSizes([])
      }
    } else {
      if (selectedSize.length > 0) {
        setSelectedSizes([])
      }
      setSelectedSize(size)
      setSelectAll(false)
      setSelectedSizes(prevSelected =>
        prevSelected.includes(size)
          ? prevSelected.filter(s => s !== size)
          : [...prevSelected, size]
      )
    }
  }

  const isSizeSelected = size =>
    selectAll ? true : selectedSizes.includes(size)

  const handleProductSelect = item => {
    if (item.tonkho === 0) {
      showToast('kho chứa đã hết hàng', 'error')
      return
    }
    setSelectedProducts(prevState =>
      prevState.includes(item.idsku)
        ? prevState.filter(productId => productId !== item.idsku)
        : [...prevState, item.idsku]
    )

    setSelectedProductsBySku(prevState => {
      const currentProductSkus = prevState[product._id] || []
      const updatedSkus = currentProductSkus.includes(item.idsku)
        ? currentProductSkus.filter(sku => sku !== item.idsku)
        : [...currentProductSkus, item.idsku]

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
    if (selectedProducts.length === 0) {
      showToast('Vui lòng chọn sản phẩm', 'error')
      return
    }
    const selectedItems = data.filter(item =>
      selectedProducts.includes(item.idsku)
    )
    const existingProducts = selected.filter(item =>
      selectedProducts.includes(item.idsku)
    )

    if (existingProducts.length > 0) {
      showToast('Sản phẩm đã có trong danh sách', 'error')
      return
    }

    onItemsSelected(selectedItems)
    setSelectedProducts([])
    onClose()
  }

  return (
    <>
      <OtherStoreModal
        isOpen={isOtherStoreModalOpen}
        onClose={() => setOtherStoreModalOpen(false)}
        stores={selectedStores}
        productName={selectedProductName}
        masku={selectedProductmaSKU}
        idsku={selectedProductidsku}
      />
      <ModalBanHang isOpen={isOpen} onClose={onClose}>
        <div className='modal-header1'>
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
              onClick={() => {
                handleSizeSelect('all')
                setSelectedSize('all')
              }}
              className={`size-btn ${
                selectAll && selectedSize === 'all' ? 'selected1' : ''
              }`}
            >
              Tất cả
            </button>
            {data.map(item => (
              <button
                key={item.name}
                onClick={() => handleSizeSelect(item.name)}
                className={`size-btn ${
                  isSizeSelected(item.name) && selectedSize !== 'all'
                    ? 'selected1'
                    : ''
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
                      <label className='ModalThemImel-label'>
                        <input
                          type='checkbox'
                          checked={filteredItems
                            .filter(item => item.tonkho > 0)
                            .every(item =>
                              selectedProducts.includes(item.idsku)
                            )}
                          onChange={() => {
                            const availableItems = filteredItems.filter(
                              item => item.tonkho > 0
                            )

                            if (
                              availableItems.every(item =>
                                selectedProducts.includes(item.idsku)
                              )
                            ) {
                              setSelectedProducts(prevState =>
                                prevState.filter(
                                  id =>
                                    !availableItems.some(
                                      item => item.idsku === id
                                    )
                                )
                              )
                            } else {
                              setSelectedProducts(prevState => [
                                ...prevState,
                                ...availableItems
                                  .filter(
                                    item => !prevState.includes(item.idsku)
                                  )
                                  .map(item => item.idsku)
                              ])
                            }
                          }}
                          className='custom-checkbox-input'
                        />
                        <span className='custom-checkbox-box'></span>
                      </label>
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
                        <label className='ModalThemImel-label'>
                          <input
                            type='checkbox'
                            checked={selectedProducts.includes(item.idsku)}
                            onChange={() => handleProductSelect(item)}
                            className='custom-checkbox-input'
                          />
                          <span className='custom-checkbox-box'></span>
                        </label>
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
                              handleViewOtherStores(
                                item.cacKhoKhac,
                                item.tensp,
                                item.masku,
                                item.idsku
                              )
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
      </ModalBanHang>
    </>
  )
}

export default ModalDataScreen
