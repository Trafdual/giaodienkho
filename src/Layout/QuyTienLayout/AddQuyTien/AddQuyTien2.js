/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { useToast } from '~/components/GlobalStyles/ToastContext'
import { ModalOnClose } from '~/components/ModalOnClose'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '~/components/Loadingnut/loadingnut.scss'
import './AddQuyTien2.scss'
import { faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { AddMucThu } from './AddMucThu'

function AddQuyTien2 ({
  onClose,
  iscloseHuy,
  setIsCloseHuy,
  resetForm,
  validateInputs,
  fetchquytien,
  mancc,
  lydo,
  date,
  method,
  loaitien,
  depotid,
  loaichungtu,
  userID
}) {
  const [rows, setRows] = useState([{ dienGiai: '', soTien: '', mucThu: '' }])
  const { showToast } = useToast()
  const [isClickButton, setIsClickButton] = useState(false)
  const [mucthudata, setmucthudata] = useState([])
  const [tongtien, setTongtien] = useState(0)
  const [isOpenModalAddMt, setIsOpenModalAddMt] = useState(false)

  useEffect(() => {
    const total = rows.reduce((acc, row) => {
      const soTien = parseFloat(row.soTien) || 0
      return acc + soTien
    }, 0)
    setTongtien(total)
  }, [rows])

  const handleClose = () => {
    setRows([])
    resetForm()
    setIsCloseHuy(false)
    onClose()
  }

  const handleInputChange = (index, field, value) => {
    setRows(prevRows =>
      prevRows.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row
      )
    )
  }

  const addRow = e => {
    if (e.key === 'Enter') {
      e.preventDefault()
      setRows(prevRows => [
        ...prevRows,
        { dienGiai: '', soTien: '', mucThu: '' }
      ])
    }
  }

  const deleteRow = index => {
    if (rows.length > 1) {
      setRows(prevRows => prevRows.filter((_, rowIndex) => rowIndex !== index))
    }
  }

  const fetchMucThu = async () => {
    try {
      const response = await fetch(
        `https://baotech.shop/getmucthuchi/${userID}`
      )
      const data = await response.json()
      setmucthudata(data)
    } catch (error) {
      console.error('Lỗi khi lấy danh sách mục thu:', error)
    }
  }

  useEffect(() => {
    fetchMucThu()
  }, [userID])

  const validateInputs2 = () => {
    if (rows.length === 0) {
      showToast('Bạn chưa thêm chi tiết', 'error')
      return false
    }
    for (const row of rows) {
      if (!row.dienGiai) {
        showToast(`diễn giải không được để trống`, 'error')
        return false
      }
      if (!row.soTien) {
        showToast(`số tiền không được để trông`, 'error')
        return false
      }
      if (row.soTien === '0') {
        showToast(`số tiền phải lớn hơn 0`, 'error')
        return false
      }
      if (!row.mucThu) {
        showToast(`bạn chưa chọn mục thu`, 'error')
        return false
      }
    }
    return true
  }

  const submitProducts = async () => {
    const products = rows.map(row => ({
      diengiai: row.dienGiai,
      sotien: row.soTien,
      mamucthu: row.mucThu
    }))

    if (validateInputs() && validateInputs2()) {
      setIsClickButton(true)
      try {
        const response = await fetch(
          `https://baotech.shop/postthuchi/${depotid}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              madoituong: mancc,
              lydo,
              date,
              method,
              loaitien,
              products,
              maloaict: loaichungtu,
              tongtien
            })
          }
        )
        const data = await response.json()
        if (data.message) {
          showToast(`${data.message}`, 'error')
        } else {
          showToast('Thêm dữ liệu thành công!', 'success')
          fetchquytien()
          handleClose()
        }
      } catch (error) {
        console.error('Lỗi khi gửi dữ liệu:', error)
        showToast(`Đã xảy ra lỗi: ${error}`, 'error')
      } finally {
        setIsClickButton(false)
      }
    }
  }

  return (
    <>
      <div>
        <h3 style={{ marginBottom: '10px' }}>Chi tiết</h3>
        <div className='divTableSP'>
          <table className='modal-table-test'>
            <thead>
              <tr>
                <th>Diễn giải</th>
                <th>Số tiền</th>
                <th>Mục thu/chi</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type='text'
                      placeholder='Nhập diễn giải'
                      value={row.dienGiai}
                      onChange={e =>
                        handleInputChange(index, 'dienGiai', e.target.value)
                      }
                      onKeyPress={e => addRow(e)}
                      className='inputDienGiaiTcTM'
                    />
                  </td>
                  <td>
                    <input
                      type='number'
                      placeholder='Nhập số tiền'
                      value={row.soTien}
                      onChange={e =>
                        handleInputChange(index, 'soTien', e.target.value)
                      }
                      className='inputSoTienTcTM'
                    />
                  </td>
                  <td>
                    <div className='tdMasku'>
                      <select
                        value={row.mucThu || 'Chọn mục thu'}
                        onChange={e =>
                          handleInputChange(index, 'mucThu', e.target.value)
                        }
                        className='selectMucThu'
                      >
                        <option value='Chọn mục thu' disabled>
                          Chọn mục thu
                        </option>

                        {mucthudata
                          .filter(mucThu => mucThu.loaimuc === loaitien)
                          .map(filteredMucThu => (
                            <option
                              key={filteredMucThu.id}
                              value={filteredMucThu.mamuc}
                            >
                              {filteredMucThu.name}
                            </option>
                          ))}
                      </select>
                      {index === 0 && ( // Chỉ hiển thị nút ở row đầu tiên
                        <button
                          className='btnaddskutest1'
                          onClick={() => setIsOpenModalAddMt(true)}
                        >
                          <FontAwesomeIcon
                            icon={faPlus}
                            className='iconaddtest1'
                          />
                        </button>
                      )}
                    </div>
                  </td>
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
      <AddMucThu
        isOpen={isOpenModalAddMt}
        onClose={() => setIsOpenModalAddMt(false)}
        fetchdata={fetchMucThu}
        userId={userID}
        loaitien={loaitien}
      />

      <button
        onClick={submitProducts}
        className={
          isClickButton ? 'btnAddNhaCungCap btnadddisabled' : 'btnAddNhaCungCap'
        }
        disabled={isClickButton}
      >
        {isClickButton ? '...Đang tải dữ liệu' : `Thêm ${loaitien}`}
      </button>
    </>
  )
}

export default AddQuyTien2
