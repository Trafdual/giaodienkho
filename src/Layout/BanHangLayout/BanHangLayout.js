/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react'
import './Banhang.scss'
import axios from 'axios'
import { FaUser, FaBarcode, FaShoppingCart, FaUserTag } from 'react-icons/fa'
import { MdSearch } from 'react-icons/md'
import ModalDataScreen from './DetailData'
import ModalThemImel from '../BanHangLayout/ModalThemImel/ModalThemImel'
import HeaderBanHang from '../BanHangLayout/HeaderBanHang/HeaderBanHang'
import { ModalAddKhachHang } from './ModalAddKhachHang'
import { getFromLocalStorage } from '~/components/MaHoaLocalStorage/MaHoaLocalStorage'
import { Tooltip } from 'react-tippy'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronDown,
  faPlus,
  faToggleOff,
  faToggleOn
} from '@fortawesome/free-solid-svg-icons'
import { ModalQrThanhToan } from './ModalQrThanhToan'
import { handleGeneratePDF } from './InHoaDon/InHoaDon'
import { useToast } from '~/components/GlobalStyles/ToastContext'
function BanHangLayout () {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [issOpenModalQR, setIsOpenModalQR] = useState(false)
  const { showToast } = useToast()
  const [isChecked, setIsChecked] = useState(false)

  const [ghino, setGhino] = useState(false)
  const [isModalOpen, setModalOpen] = useState(false)
  const [imeiList, setImeiList] = useState([])
  const [selectedSku, setSelectedSku] = useState(null)
  const [InputSoLuong, setInputSoLuong] = useState(false)
  const [InputDonGian, setInputDonGian] = useState(false)
  const [inhoadon, setinhoadon] = useState(true)
  const [hoadondata, sethoadondata] = useState({})
  const [isModalOpenKh, setIsModalOpenKh] = useState(false)

  const [isOpen, setIsOpen] = useState(false)
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedItems, setSelectedItems] = useState([])
  const [allSelectedImeis, setAllSelectedImeis] = useState([])
  const [isTableKhachHang, setisTableKhachHang] = useState(false)
  const [isTableMethod, setisTableMethod] = useState(false)
  const [isTableNganHang, setisTableNganHang] = useState(false)
  const [makh, setmakh] = useState('')
  const [textnganhang, setTextnganhang] = useState('')
  const [nganhang, setnganhang] = useState('')

  const [textkh, settextkh] = useState('')
  const methods = ['Tiền mặt', 'Chuyển khoản']
  const [datcoc, setdatcoc] = useState(0)
  const [method, setmethod] = useState('Tiền mặt')
  const [nganhangs, setnganhangs] = useState([])
  const [isFocused, setIsFocused] = useState(false)

  const [datakhachang, setdatakhachang] = useState([])
  const [inputValue, setInputValue] = useState(0)

  const storedKhoID = localStorage.getItem('khoIDBH')
  const userId = getFromLocalStorage('userId') || ''
  const idkho1 = localStorage.getItem('khoIDBH')

  const inputRef = useRef()

  // Hàm xử lý khi checkbox được tích hoặc bỏ tích
  const handleCheckboxChange = () => {
    setIsChecked(prevState => {
      const newCheckedState = !prevState
      setGhino(newCheckedState)
      return newCheckedState
    })
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatDate = date => {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${day}/${month}/${year} - ${hours}:${minutes}`
  }

  //....

  const handleItemsSelected = items => {
    const updatedItems = items.map(item => ({
      ...item,
      selectedImeis: item.selectedImeis || [],
      soluong: item.soluong || 1,
      dongia: item.dongia || 0,
      thanhtien: item.soluong * (item.dongia || 0)
    }))
    setSelectedItems(prev => [...prev, ...updatedItems])
  }

  const handleOpenModal = async idSku => {
    try {
      const response = await axios.get(
        `https://www.ansuataohanoi.com/getsanphamchon/${idkho1}/${idSku}`
      )
      const data = response.data
      console.log('Dữ liệu IMEI từ API:', data)

      if (Array.isArray(data)) {
        setImeiList(data)
      } else {
        console.warn('Dữ liệu không phải là một mảng:', data)
        setImeiList([])
      }

      setModalOpen(true)
      setSelectedSku(idSku)
    } catch (error) {
      console.error('Lỗi khi gọi API lấy danh sách IMEI:', error)
      setImeiList([])
    }
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setImeiList([])
    setSelectedSku(null)
  }
  const handleImeiConfirm = selectedImeis => {
    setSelectedItems(prevItems =>
      prevItems.map(item =>
        item.idsku === selectedSku
          ? {
              ...item,
              selectedImeis: Array.from(
                new Set([...item.selectedImeis, ...selectedImeis])
              ),
              soluong:
                selectedImeis.length > 0
                  ? selectedImeis.length
                  : item.soluong || 1
            }
          : item
      )
    )

    setAllSelectedImeis(prev =>
      Array.from(new Set([...prev, ...selectedImeis]))
    )
  }

  const handleRemoveImei = (idSku, imeiToRemove) => {
    setSelectedItems(prevItems =>
      prevItems.map(item => {
        if (item.idsku === idSku) {
          const updatedImeis = item.selectedImeis.filter(
            (_, i) => i !== imeiToRemove
          )
          return {
            ...item,
            selectedImeis: updatedImeis,
            soluong: updatedImeis.length
          }
        }
        return item
      })
    )

    setAllSelectedImeis(prev => prev.filter((_, i) => i !== imeiToRemove))
  }

  useEffect(() => {
    const fetchProducts = async () => {
      if (!userId) return
      try {
        const response = await axios.get(
          `https://www.ansuataohanoi.com/getspbanhang/${userId}`
        )
        setProducts(response.data)
      } catch (error) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error)
      }
    }

    fetchProducts()
  }, [userId])

  const handleProductClick = product => {
    console.log(product)
    setSelectedProduct(product)
    setIsOpen(true)
  }

  const handleRemove = index => {
    setSelectedItems(prevRows =>
      prevRows.filter((_, rowIndex) => rowIndex !== index)
    )
  }

  const handleManualQuantityChange = (idSku, quantity) => {
    setSelectedItems(prevItems =>
      prevItems.map(item =>
        item.idsku === idSku &&
        (!item.selectedImeis || item.selectedImeis.length === 0)
          ? {
              ...item,
              soluong: quantity === '' ? '' : Math.max(1, Number(quantity)),
              thanhtien: Math.max(1, Number(quantity)) * (item.dongia || 0)
            }
          : item
      )
    )
  }

  const handleDonGiaChange = (idSku, newPrice) => {
    setSelectedItems(prevItems =>
      prevItems.map(item =>
        item.idsku === idSku
          ? {
              ...item,
              dongia: newPrice === '' ? '' : Math.max(0, Number(newPrice)),
              thanhtien: (item.soluong || 0) * Math.max(0, Number(newPrice))
            }
          : item
      )
    )
  }

  const handleKhacHang = async () => {
    try {
      const response = await fetch(
        `https://www.ansuataohanoi.com/getkhachhang/${storedKhoID}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      if (response.ok) {
        const data = await response.json()
        setdatakhachang(data)
        setisTableKhachHang(!isTableKhachHang)
        console.log('Dữ liệu khách hàng từ API:', data)
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu khách hàng:', error)
    }
  }

  const fetchnganhang = async () => {
    try {
      const response = await fetch(
        `https://www.ansuataohanoi.com/getnganhang/${userId}`
      )
      const data = await response.json()

      if (response.ok) {
        setnganhangs(data)
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu ngân hàng:', error)
    }
  }
  useEffect(() => {
    fetchnganhang()
  }, [userId])

  const totalAmount = selectedItems.reduce(
    (total, item) => total + (item.thanhtien || 0),
    0
  )
  const validate = () => {
    let valid = true

    if (selectedItems.length === 0) {
      showToast('Bạn chưa chọn sản phẩm nào', 'error')
      valid = false
    } else if (selectedItems.some(item => item.soluong === 0)) {
      showToast('Sản phẩm đã chọn có số lượng 0', 'error')
      valid = false
    } else if (selectedItems.some(item => item.dongia === 0)) {
      showToast('bạn chưa nhập đơn giá', 'error')
      valid = false
    }

    return valid
  }
  const handleThanhToan = async () => {
    const tienkhachtra = inputValue === 0 ? totalAmount : inputValue

    const products = selectedItems.map(row => ({
      imelist: row.selectedImeis,
      dongia: row.dongia,
      soluong: row.soluong,
      idsku: row.idsku
    }))
    try {
      if (validate()) {
        const response = await fetch(
          `http://localhost:8080/postchonsanpham/${storedKhoID}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              tienkhachtra: tienkhachtra,
              datcoc: datcoc,
              method: method,
              idnganhang: nganhang,
              makh: makh,
              ghino: ghino,
              products: products
            })
          }
        )
        const data = await response.json()
        if (response.ok) {
          showToast('thanh toán thành công', 'success')
          setSelectedItems([])
          sethoadondata(data)
          if (inhoadon === true) {
            handleGeneratePDF(data)
          }
        } else {
          console.error('Lỗi thanh toán')
        }
      }
    } catch (error) {
      console.error('Lỗi khi thanh toán hóa đơn:', error)
    }
  }

  return (
    <div className='app-container'>
      <div className='row'>
        <div className='column left-column'>
          <div className='head'>
            <div className='search-bar-section'>
              <div className='search-bar'>
                <label>Tìm kiếm</label>
                <input
                  type='text'
                  placeholder='(F3) Nhập tên hàng hóa, mã vạch, mã SKU'
                  className='search-input'
                />
                <MdSearch className='search-icon' />
                <input type='number' value='1' className='quantity-input' />
                <FaBarcode className='barcode-icon' />
                <FaUser className='staff-icon' />
                <FaUserTag className='price-tag-icon' />
              </div>
            </div>
            <div className='selected-products-container'>
              <h3>Danh sách sản phẩm đã chọn:</h3>
              <table className='product-table'>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>SKU</th>
                    <th>Hàng hóa</th>
                    <th>Số Lượng</th>
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
                          {item.loaihanghoa === 'Điện thoại' && (
                            <>
                              <div className='selected-imeis'>
                                {item.selectedImeis &&
                                item.selectedImeis.length > 0
                                  ? item.selectedImeis.map((imei, index) => (
                                      <button
                                        key={index}
                                        className='imei-btn'
                                        onClick={() =>
                                          handleRemoveImei(item.idsku, index)
                                        }
                                      >
                                        {imei} ✕
                                      </button>
                                    ))
                                  : 'Chưa chọn IMEI'}
                              </div>
                              <button
                                className='select-serial-btn'
                                onClick={() => handleOpenModal(item.idsku)}
                              >
                                Chọn Serial/IMEI
                              </button>
                            </>
                          )}
                        </td>
                        <td
                          onClick={() => setInputSoLuong(true)}
                          onMouseLeave={() => {
                            setInputSoLuong(false)
                            handleManualQuantityChange(item.idsku, item.soluong)
                          }}
                        >
                          {!InputSoLuong ? (
                            item.soluong
                          ) : (
                            <input
                              ref={inputRef}
                              type='number'
                              value={item.soluong === '' ? '' : item.soluong}
                              onChange={e =>
                                handleManualQuantityChange(
                                  item.idsku,
                                  e.target.value
                                )
                              }
                              onBlur={() => {
                                if (item.soluong === '' || item.soluong === 1) {
                                  handleManualQuantityChange(item.idsku, 1)
                                  setInputSoLuong(false)
                                } else {
                                  handleManualQuantityChange(
                                    item.idsku,
                                    item.soluong
                                  )
                                  setInputSoLuong(false)
                                }
                              }}
                              className={`inputbanhang`}
                            />
                          )}
                        </td>
                        <td
                          onClick={() => setInputDonGian(true)}
                          onMouseLeave={() => {
                            setInputDonGian(false)
                            handleManualQuantityChange(item.idsku, item.dongia)
                          }}
                        >
                          {!InputDonGian ? (
                            item.dongia.toLocaleString()
                          ) : (
                            <input
                              type='number'
                              placeholder='Nhập đơn giá'
                              value={item.dongia === '' ? '' : item.dongia}
                              onChange={e =>
                                handleDonGiaChange(item.idsku, e.target.value)
                              }
                              onBlur={() => {
                                handleDonGiaChange(item.idsku, item.dongia)
                                setInputDonGian(false)
                              }}
                              className={`inputbanhang`}
                            />
                          )}
                        </td>
                        <td>
                          {item.thanhtien ? item.thanhtien.toLocaleString() : 0}
                          VND
                        </td>
                        <td>
                          <button
                            className='remove-btn'
                            onClick={() => handleRemove(index)}
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

          <div className='prd'>
            <h3>Danh sách sản phẩm</h3>
            <div className='product-grid'>
              {products.length > 0 ? (
                products.map((product, index) => (
                  <div
                    key={index}
                    className='product-card'
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

        <div className='checkout-section'>
          <div className='divtinhtien'>
            <div className='checkout-header'>
              <span>{formatDate(currentTime)}</span>
              <button className='store-btn'>Tại cửa hàng</button>
            </div>

            <div className='customer-info'>
              <div className='customer-input-section'>
                <MdSearch className='iconbanhang' />

                <Tooltip
                  trigger='click'
                  interactive
                  arrow
                  position='bottom'
                  open={isTableKhachHang}
                  onRequestClose={() => setisTableKhachHang(false)}
                  html={
                    <div
                      className='supplier-table-container'
                      //  ref={tooltipRefMethod}
                    >
                      <table className='supplier-info-table'>
                        <thead>
                          <tr>
                            <th>Khách hàng</th>
                          </tr>
                        </thead>
                        <tbody>
                          {datakhachang.map((khachhang, index) => (
                            <tr className='trdulieu' key={index}>
                              <td
                                onClick={() => {
                                  setmakh(khachhang.makh)
                                  settextkh(
                                    `${khachhang.name} - ${khachhang.phone}`
                                  )
                                  setisTableKhachHang(!isTableKhachHang)
                                }}
                              >
                                {khachhang.name} - {khachhang.phone}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  }
                >
                  <input
                    type='text'
                    placeholder='(F4) SĐT, tên khách hàng'
                    className='customer-input'
                    onClick={() => handleKhacHang()}
                    value={textkh}
                  />
                </Tooltip>

                <FontAwesomeIcon
                  icon={faPlus}
                  className='iconaddkhachhang'
                  onClick={() => setIsModalOpenKh(true)}
                />
                <FaShoppingCart className='iconbanhang' />
              </div>
            </div>

            <div className='checkout-summary'>
              <div className='summary-item'>
                <span>Tổng tiền</span>
                <span>{totalAmount.toLocaleString()}</span>
              </div>
              <div className='summary-item'>
                <span>Đặt cọc</span>
                <input
                  type='text'
                  value={datcoc}
                  onChange={e => setdatcoc(e.target.value)}
                  className='inputBanHang'
                />
              </div>
              <div className='summary-item'>
                <span>Còn phải thu</span>
                <span>{(totalAmount - datcoc).toLocaleString()}</span>
              </div>

              <div className='payment-method'>
                <Tooltip
                  trigger='click'
                  interactive
                  arrow
                  position='bottom'
                  open={isTableMethod}
                  onRequestClose={() => setisTableMethod(false)}
                  html={
                    <div
                      className='supplier-table-container'
                      //  ref={tooltipRefMethod}
                    >
                      <table className='supplier-info-table'>
                        <thead>
                          <tr>
                            <th>Phương thức</th>
                          </tr>
                        </thead>
                        <tbody>
                          {methods.map((method, index) => (
                            <tr className='trdulieu' key={index}>
                              <td
                                onClick={() => {
                                  setmethod(method)
                                  setisTableMethod(!isTableMethod)
                                }}
                              >
                                {method}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  }
                >
                  <span onClick={() => setisTableMethod(!isTableMethod)}>
                    {method}
                  </span>
                </Tooltip>
                <input
                  onClick={() => setIsFocused(true)} // Khi focus
                  onBlur={() => setIsFocused(false)} // Khi mất focus
                  className={isFocused ? 'border-bottom' : 'inputBanHang'}
                  value={
                    inputValue
                      ? inputValue.toLocaleString()
                      : totalAmount.toLocaleString()
                  }
                  onChange={e => setInputValue(e.target.value)}
                />
              </div>
              {method === 'Chuyển khoản' && (
                <div className='TaiKhoanThu'>
                  <h4>Tài khoản thu</h4>

                  <Tooltip
                    trigger='click'
                    interactive
                    arrow
                    position='bottom'
                    open={isTableNganHang}
                    onRequestClose={() => setisTableNganHang(false)}
                    html={
                      <div
                        className='supplier-table-container'
                        //  ref={tooltipRefMethod}
                      >
                        <table className='supplier-info-table'>
                          <thead>
                            <tr>
                              <th>Ngân Hàng</th>
                            </tr>
                          </thead>
                          <tbody>
                            {nganhangs.map((nganhang, index) => (
                              <tr className='trdulieu' key={index}>
                                <td
                                  onClick={() => {
                                    setTextnganhang(
                                      `${nganhang.sotaikhoan} - ${nganhang.name}`
                                    )
                                    setnganhang(nganhang.manganhangkho)
                                    setisTableNganHang(!isTableNganHang)
                                  }}
                                >
                                  {nganhang.sotaikhoan} - {nganhang.name}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    }
                  >
                    <button
                      onClick={() => setisTableNganHang(!isTableNganHang)}
                    >
                      {textnganhang ? textnganhang : 'Chọn ngân hàng'}
                      <FontAwesomeIcon icon={faChevronDown} />
                    </button>
                  </Tooltip>
                </div>
              )}

              <div className='summary-item'>
                <span>Trả lại khách</span>
                <span>
                  {inputValue
                    ? Number(inputValue - totalAmount).toLocaleString()
                    : Number(totalAmount - totalAmount).toLocaleString()}
                </span>
              </div>
            </div>

            <div className='additional-options'>
              <label>
                <input
                  type='checkbox'
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
                Tính vào công nợ
              </label>
              <input
                type='text'
                placeholder='Ghi chú ...'
                className='notes-input'
              />
            </div>
          </div>
          <div className='divbtncnthanhtoan'>
            <div className='divInhoadon'>
              <FontAwesomeIcon
                icon={inhoadon ? faToggleOn : faToggleOff}
                onClick={() => setinhoadon(!inhoadon)}
                className={`iconInhoadon ${inhoadon ? 'on' : 'off'}`}
              />
              <p>In hóa đơn</p>
            </div>
            <div className='divgoiytienmat'>
              <div>Gợi ý tiền mặt</div>
              <hr />
            </div>

            <div className='cash-suggestions'>
              <button>500.000</button>
              <button>200.000</button>
              <button>100.000</button>
            </div>

            <div className='checkout-actions'>
              <button className='save-btn'>Lưu tạm (F10)</button>
              <button className='pay-btn' onClick={handleThanhToan}>
                Thu tiền (F9)
              </button>
            </div>
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
          selected={selectedItems}
        />
      )}

      <ModalThemImel
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        imeiList={imeiList}
        onConfirm={handleImeiConfirm}
        allSelectedImeis={allSelectedImeis}
      />
      <ModalQrThanhToan
        isOpen={issOpenModalQR}
        onClose={() => setIsOpenModalQR(false)}
        Tongtien={totalAmount}
      />
      <ModalAddKhachHang
        isOpen={isModalOpenKh}
        onClose={() => setIsModalOpenKh(false)}
        fetchData={handleKhacHang}
        userId={userId}
        khoID={storedKhoID}
      />
    </div>
  )
}

export default BanHangLayout
