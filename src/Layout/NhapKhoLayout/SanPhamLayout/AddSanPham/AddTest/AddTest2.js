/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react'
import { useToast } from '../../../../../components/GlobalStyles/ToastContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { Tooltip } from 'react-tippy'
import 'react-tippy/dist/tippy.css'
import './AddTest2.scss'

function AddTest2 ({
  fetchlohang,
  mancc,
  name,
  date,
  ghino,
  method,
  hour,
  manganhangkho,
  loaihanghoa,
  onClose
}) {
  const [skudata, setSkudata] = useState([])
  const [userID, setUserID] = useState(localStorage.getItem('userId') || '')
  const [loadingSuppliers, setLoadingSuppliers] = useState(true)
  const [isTableVisible, setIsTableVisible] = useState(false)
  const { showToast } = useToast()
  const [rows, setRows] = useState([])
  const [imel, setImel] = useState('')
  const [isEditingIMEI, setIsEditingIMEI] = useState([])
  const [isEditingPrice, setIsEditingPrice] = useState([])
  const [isRemoving, setIsRemoving] = useState(true)
  const [selectedSKUs, setSelectedSKUs] = useState([])

  const imeiInputRef = useRef(null)

  const toggleIMEIEdit = index => {
    setIsEditingIMEI(prev => {
      const updated = Array.isArray(prev) ? [...prev] : [] // Đảm bảo prev là mảng
      updated[index] = !updated[index]
      return updated
    })
  }

  const togglePriceEdit = index => {
    setIsEditingPrice(prev => {
      const updated = Array.isArray(prev) ? [...prev] : [] // Đảm bảo prev là mảng
      updated[index] = !updated[index]
      return updated
    })
  }

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

  const handleClose = () => {
    setRows([])
    onClose()
  }

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

    // Cập nhật danh sách SKU đã chọn
    setSelectedSKUs(prevSelectedSKUs => [
      ...prevSelectedSKUs,
      selectedSKU.madungluong
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
      prevRows.map((row, rowIndex) => {
        if (rowIndex !== index) return row // Giữ nguyên hàng nếu không phải hàng đang được cập nhật

        const updatedRow = { ...row, [field]: value }

        if (field === 'price' || field === 'soluong') {
          const price = parseFloat(updatedRow.price.replace(/\./g, '')) || 0
          const quantity = updatedRow.soluong || 0
          updatedRow.tongtien = price * quantity
        }

        return updatedRow
      })
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
    setTimeout(() => setIsRemoving(true), 0)
    setTimeout(() => {
      imeiInputRef.current?.focus() // Đặt lại focus vào input
    }, 0)
  }

  const submitProducts = async () => {
    const products = rows.map(row => ({
      madungluongsku: row.masku,
      imelList: row.imel,
      name: row.name, // Tên từng sản phẩm
      price: row.price || 0 // Giá từng sản phẩm
    }))

    const payload = {
      products,
      mancc,
      name,
      date,
      ghino,
      method,
      hour,
      manganhangkho,
      loaihanghoa
    }

    try {
      const response = await fetch(
        `https://www.ansuataohanoi.com/postloaisanpham3`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      )

      if (response.ok) {
        showToast('Thêm lô hàng thành công!', 'success')
        handleClose()
        fetchlohang()
      } else {
        showToast('Lỗi khi thêm lô hàng', 'error')
      }
    } catch (error) {
      console.error('Lỗi khi gửi dữ liệu lô hàng:', error)
      showToast(`Đã xảy ra lỗi khi thêm lô hàng ${error}`, 'error')
    }
  }

  return (
    <>
      <div>
        <h3 style={{ marginBottom: '10px' }}>Chi tiết</h3>
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
                  onClick={() => toggleIMEIEdit(index)}
                  style={{ cursor: 'pointer' }}
                >
                  {isEditingIMEI[index] ? (
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
                <td onClick={() => togglePriceEdit(index)}>
                  {isEditingPrice[index] ? (
                    <input
                      type='text'
                      placeholder='Đơn giá'
                      className='imel-input'
                      value={
                        row.price
                          ? new Intl.NumberFormat().format(row.price)
                          : ''
                      }
                      onChange={e => {
                        const rawValue = e.target.value.replace(/\./g, '')
                        const numericValue = parseFloat(rawValue)

                        // Chỉ cập nhật nếu giá trị là hợp lệ
                        if (!isNaN(numericValue) || rawValue === '') {
                          handleInputChange(index, 'price', rawValue) // Cập nhật giá trị
                        }
                      }}
                      autoFocus
                      onBlur={() => setIsEditingPrice(false)}
                    />
                  ) : row.price ? (
                    new Intl.NumberFormat().format(row.price.replace(/\./g, ''))
                  ) : (
                    'Nhập đơn giá'
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
                            {skudata.filter(
                              supplier =>
                                !selectedSKUs.includes(supplier.madungluong)
                            ).length > 0 ? (
                              skudata
                                .filter(
                                  supplier =>
                                    !selectedSKUs.includes(supplier.madungluong)
                                )
                                .map(supplier => (
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
                                ))
                            ) : (
                              <tr>
                                <td colSpan={'2'}>Không có mã sku nào</td>
                              </tr>
                            )}
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
      <button onClick={submitProducts} className='btnAddLoHang'>
        Thêm lô hàng
      </button>
    </>
  )
}

export default AddTest2
