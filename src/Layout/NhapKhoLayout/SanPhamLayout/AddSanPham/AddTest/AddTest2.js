/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react'
import { useToast } from '../../../../../components/GlobalStyles/ToastContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBarcode,
  faChevronDown,
  faPlus,
  faTrashCan
} from '@fortawesome/free-solid-svg-icons'
import { Tooltip } from 'react-tippy'
import 'react-tippy/dist/tippy.css'
import './AddTest2.scss'
import { ModalOnClose } from '~/components/ModalOnClose'
import { ModalAddSku } from './ModalAddSku'
import { FormAddImel } from '../FormAddImel'
import '~/components/Loadingnut/loadingnut.scss'
import { getFromLocalStorage } from '~/components/MaHoaLocalStorage/MaHoaLocalStorage'

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
  onClose,
  iscloseHuy,
  setIsCloseHuy,
  validateInputs,
  resetForm
}) {
  const [skudata, setSkudata] = useState([])
  const [userID, setUserID] = useState(getFromLocalStorage('userId') || '')
  const [loadingSuppliers, setLoadingSuppliers] = useState(true)
  const [isTableVisible, setIsTableVisible] = useState(false)
  const { showToast } = useToast()
  const [rows, setRows] = useState([])
  const [imel, setImel] = useState('')
  const [isEditingIMEI, setIsEditingIMEI] = useState([])
  const [isEditingPrice, setIsEditingPrice] = useState([])
  const [isEditingSoluong, setIsEditingSoluong] = useState([])

  const [isRemoving, setIsRemoving] = useState(true)
  const [selectedSKUs, setSelectedSKUs] = useState([])
  const [isOpenAddSKU, setIsOpenAddSKU] = useState(false)
  const [isOpenModalBarCode, setIsOpenModalBarCode] = useState(false)
  const [indexImel, setindex] = useState(null)
  const [isClickButton, setIsClickButton] = useState(false)

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
  const toggleSoluongEdit = index => {
    setIsEditingSoluong(prev => {
      const updated = Array.isArray(prev) ? [...prev] : []
      updated[index] = !updated[index]
      return updated
    })
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newuserID = getFromLocalStorage('userId') || ''
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
    resetForm()
    setIsCloseHuy(false)
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
        const isDuplicate = rows.some(row => row.imel.includes(imel))

        if (isDuplicate) {
          showToast('IMEL đã tồn tại trong danh sách', 'error')
        } else {
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
        }
        setImel('')
      }
    }
  }

  const handleAddImel = (index, result) => {
    if (result) {
      const isDuplicate = rows.some(row => row.imel.includes(result))

      if (isDuplicate) {
        showToast('IMEL đã tồn tại trong danh sách', 'error')
      } else {
        setRows(prevRows =>
          prevRows.map((row, rowIndex) =>
            rowIndex === index
              ? {
                  ...row,
                  imel: [...row.imel, result],
                  soluong: row.imel.length + 1
                }
              : row
          )
        )
      }
    }
  }

  const handleInputChange = (index, field, value) => {
    setRows(prevRows =>
      prevRows.map((row, rowIndex) => {
        if (rowIndex !== index) return row

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
  const validateInputs2 = () => {
    if (rows.length === 0) {
      showToast('Bạn chưa thêm chi tiết', 'error')
      return false
    }
    for (const row of rows) {
      if (!row.soluong) {
        showToast(`Số lượng không được để trống`, 'error')
        return false
      }
      if (!row.price) {
        showToast(`đơn giá không được để trống`, 'error')
        return false
      }
    }
    return true
  }

  const submitProducts = async () => {
    const products = rows.map(row => ({
      madungluongsku: row.masku,
      imelList: row.imel,
      name: row.name, // Tên từng sản phẩm
      price: row.price || 0, // Giá từng sản phẩm
      soluong: row.soluong
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
    if (validateInputs() && validateInputs2()) {
      setIsClickButton(true)
      try {
        const response = await fetch(
          `https://www.ansuataohanoi.com/postloaisanpham4`,
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
          setIsClickButton(false)
        } else {
          showToast('Lỗi khi thêm lô hàng', 'error')
        }
      } catch (error) {
        console.error('Lỗi khi gửi dữ liệu lô hàng:', error)
        showToast(`Đã xảy ra lỗi khi thêm lô hàng ${error}`, 'error')
      }
    }
  }
  const deleteRow = index => {
    setRows(prevRows => prevRows.filter((_, rowIndex) => rowIndex !== index))
  }

  // useEffect(() => {
  //   const eventSource = new EventSource('https://www.ansuataohanoi.com/events')

  //   eventSource.onmessage = event => {
  //     const newMessage = JSON.parse(event.data)
  //     showToast(newMessage.message)
  //     fetchlohang()
  //   }
  //   return () => {
  //     eventSource.close()
  //   }
  // }, [])

  return (
    <>
      <div>
        <h3 style={{ marginBottom: '10px' }}>Chi tiết</h3>
        <div className='divTableSP'>
          <table className='modal-table-test'>
            <thead>
              <tr>
                <th>Mã SKU</th>
                <th>Tên máy</th>
                {loaihanghoa === 'Điện thoại' && <th>Imel</th>}
                <th>Số lượng</th>
                <th>Đơn giá</th>
                <th>Tổng tiền</th>
                <td></td>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  <td>{row.masku}</td>
                  <td>{row.name}</td>
                  {loaihanghoa === 'Điện thoại' && (
                    <td
                      onClick={() => toggleIMEIEdit(index)}
                      style={{ cursor: 'pointer' }}
                    >
                      {isEditingIMEI[index] ? (
                        <div className='imel-input-container'>
                          {row.imel.map((item, imelIndex) => (
                            <span key={imelIndex} className='imel-tag'>
                              {item}
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
                          <div className='divnhapImel'>
                            <input
                              ref={imeiInputRef}
                              type='text'
                              value={imel}
                              placeholder='Nhập IMEI'
                              onKeyPress={event => handleKeyPress(index, event)}
                              onChange={e => setImel(e.target.value)}
                              className='imel-input'
                              autoFocus
                            />
                            <button
                              className='btnnhapImel'
                              onClick={() => {
                                setIsOpenModalBarCode(true)
                                setindex(index)
                              }}
                            >
                              <FontAwesomeIcon icon={faBarcode} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        row.imel.join(', ') || 'Nhập IMEI'
                      )}
                    </td>
                  )}
                  <FormAddImel
                    isOpen={isOpenModalBarCode}
                    onClose={() => setIsOpenModalBarCode(false)}
                    index={indexImel}
                    handleAddImel={handleAddImel}
                  />
                  <td onClick={() => toggleSoluongEdit(index)}>
                    {isEditingSoluong[index] ? (
                      <input
                        type='text'
                        placeholder='Nhập số lượng'
                        className='imel-input'
                        value={row.soluong || ''}
                        onChange={e => {
                          const inputValue = e.target.value
                          if (inputValue === '' || inputValue === '0') {
                            handleInputChange(index, 'soluong', null)
                          } else {
                            const value = parseInt(inputValue, 10)
                            if (!isNaN(value)) {
                              handleInputChange(index, 'soluong', value)
                            }
                          }
                        }}
                        autoFocus
                        onBlur={() => {
                          setIsEditingSoluong(prev => {
                            const updated = [...prev]
                            updated[index] = false
                            return updated
                          })

                          // Kiểm tra nếu có IMEI thì lấy độ dài IMEI
                          if (row.imel && row.imel.length > 0) {
                            setRows(prevRows =>
                              prevRows.map((r, i) =>
                                i === index
                                  ? { ...r, soluong: r.imel.length }
                                  : r
                              )
                            )
                          }
                        }}
                      />
                    ) : (
                      row.soluong || 'Nhập số lượng'
                    )}
                  </td>
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
                          if (
                            (!isNaN(numericValue) && numericValue > 0) ||
                            rawValue === ''
                          ) {
                            handleInputChange(index, 'price', rawValue) // Cập nhật giá trị
                          }
                        }}
                        autoFocus
                        onBlur={() => setIsEditingPrice(false)}
                      />
                    ) : row.price ? (
                      new Intl.NumberFormat().format(
                        row.price.replace(/\./g, '')
                      )
                    ) : (
                      'Nhập đơn giá'
                    )}
                  </td>
                  <td>{new Intl.NumberFormat().format(row.tongtien)}</td>
                  <td>
                    <button
                      className='btnDeleterow'
                      onClick={() => deleteRow(index)}
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td>
                  <div className='tdMasku'>
                    <Tooltip
                      trigger='click'
                      interactive
                      arrow
                      position='bottom-start'
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
                                        !selectedSKUs.includes(
                                          supplier.madungluong
                                        )
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
                    <button
                      className='btnaddskutest'
                      onClick={() => setIsOpenAddSKU(true)}
                    >
                      <FontAwesomeIcon icon={faPlus} className='iconaddtest' />
                    </button>
                    <ModalAddSku
                      isOpen={isOpenAddSKU}
                      onClose={() => setIsOpenAddSKU(false)}
                      fetchsku={fetchSku}
                      userID={userID}
                    />
                  </div>
                </td>

                <td colSpan='5'></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <ModalOnClose
        isOpen={iscloseHuy}
        Save={submitProducts}
        DontSave={handleClose}
        Cancel={() => setIsCloseHuy(false)}
      />

      <button
        onClick={submitProducts}
        className={
          isClickButton ? 'btnAddNhaCungCap btnadddisabled' : 'btnAddNhaCungCap'
        }
        disabled={isClickButton}
      >
        {isClickButton ? '...Đang tải dữ liệu' : 'Thêm sản phẩm'}
      </button>
    </>
  )
}

export default AddTest2
