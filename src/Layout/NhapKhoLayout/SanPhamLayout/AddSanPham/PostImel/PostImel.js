/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react'
import { useToast } from '../../../../../components/GlobalStyles/ToastContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronDown,
  faPlus,
  faTrashCan,
  faBarcode
} from '@fortawesome/free-solid-svg-icons'
import { Tooltip } from 'react-tippy'
import 'react-tippy/dist/tippy.css'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-time-picker/dist/TimePicker.css'
import 'react-clock/dist/Clock.css'
import { ModalBig } from '~/components/ModalBig'

import { getFromLocalStorage } from '~/components/MaHoaLocalStorage/MaHoaLocalStorage'
import 'react-tippy/dist/tippy.css'
import { ModalOnClose } from '~/components/ModalOnClose'
import { ModalAddSku } from '../AddTest/ModalAddSku'
import { FormAddImel } from '../FormAddImel'
import '~/components/Loadingnut/loadingnut.scss'

function PostImel ({ isOpen, onClose }) {
  const { showToast } = useToast()

  const [isModalHuy, setIsModalHuy] = useState(false)
  const [malohang, setmalohang] = useState('')
  const [malohangError, setmalohangError] = useState('')
  const [khoID, setKhoID] = useState(localStorage.getItem('khoID') || '')
  const [userID, setuserID] = useState(getFromLocalStorage('userId') || '')
  const [skudata, setSkudata] = useState([])
  const [loadingSuppliers, setLoadingSuppliers] = useState(true)
  const [isTableVisible, setIsTableVisible] = useState(false)
  const [rows, setRows] = useState([])
  const [imel, setImel] = useState('')
  const [isEditingIMEI, setIsEditingIMEI] = useState([])
  const [rowimel, setRowimel] = useState([])

  const [isRemoving, setIsRemoving] = useState(true)
  const [selectedSKUs, setSelectedSKUs] = useState([])
  const [isOpenAddSKU, setIsOpenAddSKU] = useState(false)
  const [isOpenModalBarCode, setIsOpenModalBarCode] = useState(false)
  const [indexImel, setindex] = useState(null)
  const [isClickButton, setIsClickButton] = useState(false)
  const [scanning, setScanning] = useState(false)

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newKhoID = localStorage.getItem('khoID') || ''
      if (newKhoID !== khoID) {
        console.log('Interval detected change, updating khoID:', newKhoID)
        setKhoID(newKhoID)
      }
    }, 1000)

    return () => clearInterval(intervalId)
  }, [localStorage.getItem('khoID')])

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newuserID = getFromLocalStorage('userId') || ''
      if (newuserID !== userID) {
        console.log('Interval detected change, updating khoID:', newuserID)
        setuserID(newuserID)
      }
    }, 1000) // Kiểm tra mỗi giây

    return () => clearInterval(intervalId)
  }, [getFromLocalStorage('userId')])

  const imeiInputRef = useRef(null)

  const toggleIMEIEdit = index => {
    setIsEditingIMEI(prev => {
      const updated = Array.isArray(prev) ? [...prev] : [] // Đảm bảo prev là mảng
      updated[index] = !updated[index]
      return updated
    })
  }

  const fetchSku = async () => {
    try {
      const response = await fetch(
        `https://ansuataohanoi.com/getdungluongsku/${userID}`
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
    setIsModalHuy(true)
  }
  const handleclosemodalhuy = () => {
    setRows([])
    setIsModalHuy(false)
    onClose()
  }

  const addRow = selectedSKU => {
    setRows(prevRows => [
      ...prevRows,
      {
        masku: selectedSKU.madungluong,
        name: selectedSKU.name,
        imel: [],
        soluong: 0
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
    if (!malohang) {
      showToast('Mã lô hàng không được để trống', 'error')
      return false
    }
    for (const row of rows) {
      if (!row.soluong) {
        showToast(`Bạn chưa nhập imel`, 'error')
        return false
      }
    }
    return true
  }

  const submitProducts = async () => {
    const products = rows.map(row => ({
      madungluongsku: row.masku,
      imelList: row.imel,
      name: row.name,
      soluong: row.soluong
    }))

    const payload = {
      malohang,
      products
    }
    if (validateInputs2()) {
      setIsClickButton(true)
      try {
        const response = await fetch(`https://ansuataohanoi.com/postimel`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        const data = await response.json()
        if (data.message) {
          showToast(`${data.message}`, 'error')
          setIsClickButton(false)
        } else {
          showToast('Thêm imel thành công!', 'success')
          setIsOpenModalBarCode(false)
          setScanning(false)
          setRowimel([])
          setRows([])
          onClose()
          setIsClickButton(false)
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

  return (
    <ModalBig isOpen={isOpen} onClose={handleClose}>
      <div>
        <h3 style={{ marginBottom: '10px' }}>Chi tiết</h3>

        <div className='divtenkho'>
          <input
            type='text'
            className={`tenkho ${malohangError ? 'input-error' : ''}`}
            placeholder=''
            value={malohang}
            onChange={e => {
              setmalohang(e.target.value)
              if (e.target.value) {
                setmalohangError('')
              }
            }}
          />
          <label htmlFor='' className='label'>
            Mã lô hàng
          </label>
        </div>

        <div className='divTableSP'>
          <table className='modal-table-test'>
            <thead>
              <tr>
                <th className='widthphantu'>Mã SKU</th>
                <th className='widthphantu'>Tên máy</th>
                <th className='widthphantu'>Imel</th>
                <th className='widthphantu'></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  <td className='widthphantu'>{row.masku}</td>
                  <td className='widthphantu'>{row.name}</td>

                  <td
                    onClick={() => toggleIMEIEdit(index)}
                    style={{ cursor: 'pointer' }}
                    className='widthphantu'
                  >
                    {isEditingIMEI[index] ? (
                      <div className='imel-input-container'>
                        {row.imel.map((item, imelIndex) => (
                          <span key={imelIndex} className='imel-tag'>
                            {item}
                            <button
                              onMouseDown={e => {
                                e.stopPropagation()
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
                              setRowimel(row.imel)
                              // setScanning(true)
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

                  <FormAddImel
                    isOpen={isOpenModalBarCode}
                    onClose={() => setIsOpenModalBarCode(false)}
                    index={indexImel}
                    handleAddImel={handleAddImel}
                    row={rowimel}
                    setrowimel={setRowimel}
                    rowindex={indexImel}
                    handelremoveimel={handleRemoveImel}
                    scanning={scanning}
                    setScanning={setScanning}
                    submitProducts={submitProducts}
                  />

                  <td className='widthphantu1'>
                    <div className='divDeleterow'>
                      <button
                        className='btnDeleterow'
                        onClick={() => deleteRow(index)}
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                      </button>
                    </div>
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
        isOpen={isModalHuy}
        Save={submitProducts}
        DontSave={handleclosemodalhuy}
        Cancel={() => handleclosemodalhuy()}
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
    </ModalBig>
  )
}

export default PostImel
