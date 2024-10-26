import React, { useState, useEffect, useRef } from 'react'
import { ModalBig } from '../../../../../components/ModalBig'
import { useToast } from '../../../../../components/GlobalStyles/ToastContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { Tooltip } from 'react-tippy'
import 'react-tippy/dist/tippy.css'
import './AddTest.scss'

function AddTest ({ isOpen, onClose, loaispid, fetchData, fetchlohang }) {
  const [skudata, setSkudata] = useState([])
  const [userID, setUserID] = useState(localStorage.getItem('userId') || '')
  const [loadingSuppliers, setLoadingSuppliers] = useState(true)
  const [isTableVisible, setIsTableVisible] = useState(false)
  const { showToast } = useToast()
  const [rows, setRows] = useState([])
  const [imel, setImel] = useState('')
  const [isEditingIMEI, setIsEditingIMEI] = useState(false)
  const [isEditingPrice, setIsEditingPrice] = useState(false)
  const [isRemoving, setIsRemoving] = useState(true)
  const imeiInputRef = useRef(null)

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newuserID = localStorage.getItem('userId') || ''
      if (newuserID !== userID) {
        setUserID(newuserID)
      }
    }, 1000)
    return () => clearInterval(intervalId)
  }, [userID])

  const fetchSku = async () => {
    try {
      const response = await fetch(
        `https://www.ansuataohanoi.com/getdungluongsku/${userID}`
      )
      const data = await response.json()

      if (response.ok) {
        setSkudata(data)
      } else {
        showToast('Không thể tải danh sách sku', 'error')
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu sku:', error)
      showToast('Không thể tải danh sách sku', 'error')
    } finally {
      setLoadingSuppliers(false)
    }
  }

  useEffect(() => {
    fetchSku()
  }, [userID])

  const addRow = selectedSKU => {
    setRows(prevRows => [
      ...prevRows,
      {
        masku: selectedSKU.madungluong,
        name: selectedSKU.name,
        imel: [],
        soluong: 0,
        price: '',
        tongtien: ''
      }
    ])
  }

  const handleKeyPress = (index, event) => {
    if (event.key === 'Enter') {
      if (imel) {
        event.preventDefault()
        setRows(prevRows =>
          prevRows.map((row, rowIndex) =>
            rowIndex === index
              ? {
                  ...row,
                  imel: [...row.imel, imel],
                  soluong: row.imel.length + 1
                }
              : row
          )
        )
        setImel('')
      }
    }
  }

  const handleInputChange = (index, field, value) => {
    setRows(prevRows =>
      prevRows.map((row, rowIndex) =>
        rowIndex === index
          ? {
              ...row,
              [field]: value,
              tongtien:
                field === 'price' || field === 'soluong'
                  ? row.price * row.soluong
                  : row.tongtien
            }
          : row
      )
    )
  }

  const handleRemoveImel = (index, imelIndex) => {
    setRows(prevRows =>
      prevRows.map((row, rowIndex) =>
        rowIndex === index
          ? {
              ...row,
              imel: row.imel.filter((_, i) => i !== imelIndex),
              soluong: row.imel.length - 1
            }
          : row
      )
    )
    setIsRemoving(false)
    setTimeout(() => setIsRemoving(true), 1)
    setTimeout(() => {
      imeiInputRef.current?.focus() // Đặt lại focus vào input
    }, 0)
  }

  return (
    <ModalBig isOpen={isOpen} onClose={onClose}>
      <div>
        <h3>Thêm sản phẩm</h3>
        <table className='modal-table-test'>
          <thead>
            <tr>
              <th>Mã SKU</th>
              <th>Tên máy</th>
              <th>Imel</th>
              <th>Số lượng</th>
              <th>Đơn giá</th>
              <th>Tổng tiền</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td>{row.masku}</td>
                <td>{row.name}</td>
                <td
                  onClick={() => setIsEditingIMEI(true)}
                  style={{ cursor: 'pointer' }}
                >
                  {isEditingIMEI ? (
                    <div className='imel-input-container'>
                      {row.imel.map((item, imelIndex) => (
                        <span key={imelIndex} className='imel-tag'>
                          {item}{' '}
                          <button
                            onMouseDown={e => {
                              e.stopPropagation() // Ngăn sự kiện blur của input
                              handleRemoveImel(index, imelIndex)
                            }}
                            className='remove-imel-btn'
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                      <input
                        ref={imeiInputRef}
                        type='text'
                        value={imel}
                        placeholder='Nhập IMEI'
                        onKeyPress={event => handleKeyPress(index, event)}
                        onChange={e => setImel(e.target.value)}
                        className='imel-input'
                        autoFocus
                        onBlur={() => {
                          if (isRemoving) {
                            setIsEditingIMEI(false) // Chỉ tắt nếu không đang xóa
                          }
                        }}
                      />
                    </div>
                  ) : (
                    row.imel.join(', ') || 'Nhập IMEI'
                  )}
                </td>
                <td>{row.soluong}</td>
                <td onClick={() => setIsEditingPrice(true)}>
                  {isEditingPrice ? (
                    <input
                      type='text'
                      placeholder='Đơn giá'
                      className='inputaddtest'
                      value={row.price}
                      onChange={e =>
                        handleInputChange(index, 'price', e.target.value)
                      }
                    />
                  ) : (
                    row.price || 'Nhập đơn giá'
                  )}
                </td>
                <td>{new Intl.NumberFormat().format(row.tongtien)}</td>
              </tr>
            ))}
            <tr>
              <td>
                <Tooltip
                  trigger='click'
                  interactive
                  arrow
                  position='bottom'
                  open={isTableVisible}
                  onRequestClose={() => setIsTableVisible(false)}
                  html={
                    <div className='supplier-table-container'>
                      {loadingSuppliers ? (
                        <p>Đang tải danh sách sku...</p>
                      ) : (
                        <table className='supplier-info-table'>
                          <thead>
                            <tr>
                              <th>Mã sku</th>
                              <th>Tên</th>
                            </tr>
                          </thead>
                          <tbody>
                            {skudata.map(supplier => (
                              <tr
                                key={supplier._id}
                                onClick={() => {
                                  addRow(supplier)
                                  setIsTableVisible(false)
                                }}
                              >
                                <td>{supplier.madungluong}</td>
                                <td>{supplier.name}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  }
                >
                  <button
                    className='btnaddtest'
                    onClick={() => setIsTableVisible(!isTableVisible)}
                  >
                    Chọn mã sku
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className='iconaddtest'
                    />
                  </button>
                </Tooltip>
              </td>
              <td colSpan='5'></td>
            </tr>
          </tbody>
        </table>
      </div>
    </ModalBig>
  )
}

export default AddTest
