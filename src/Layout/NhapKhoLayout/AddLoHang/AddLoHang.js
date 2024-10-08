/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useEffect } from 'react'
import { Modal } from '../../../components/Modal'
import { useToast } from '../../../components/GlobalStyles/ToastContext'
import './AddLoHang.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

function AddLoHang ({ isOpen, onClose, setlohang }) {
  const [name, setName] = useState('')
  const [soluong, setsoluong] = useState('')
  const [tongtien, settongtien] = useState('')
  const [date, setdate] = useState('')
  const [mancc, setmancc] = useState('')
  const [isTableVisible, setIsTableVisible] = useState(false) // Thêm biến để điều khiển hiển thị bảng

  const { showToast } = useToast()
  const [nameError, setNameError] = useState('')
  const [soluongError, setsoluongError] = useState('')
  const [tongtienError, settongtienError] = useState('')
  const [dateError, setdateError] = useState('')
  const [manccError, setmanccError] = useState('')
  const [suppliers, setSuppliers] = useState([]) // Danh sách nhà cung cấp
  const [loadingSuppliers, setLoadingSuppliers] = useState(true) // Trạng thái tải dữ liệu
  const [khoID, setKhoID] = useState(localStorage.getItem('khoID') || '')

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newKhoID = localStorage.getItem('khoID') || ''
      if (newKhoID !== khoID) {
        console.log('Interval detected change, updating khoID:', newKhoID)
        setKhoID(newKhoID)
      }
    }, 1000) // Kiểm tra mỗi giây

    return () => clearInterval(intervalId)
  }, [localStorage.getItem('khoID')])

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch(
          `https://www.ansuataohanoi.com/getnhacungcap/${khoID}`
        ) // Thay đổi URL API theo ý muốn
        const data = await response.json()

        if (response.ok) {
          setSuppliers(data) // Giả sử data là mảng các nhà cung cấp
          console.error(suppliers)
        } else {
          showToast('Không thể tải danh sách nhà cung cấp', 'error')
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu nhà cung cấp:', error)
        showToast('Không thể tải danh sách nhà cung cấp', 'error')
      } finally {
        setLoadingSuppliers(false)
      }
    }

    fetchSuppliers()
  }, [khoID, showToast])

  const validateInputs = () => {
    let valid = true

    if (!name) {
      setNameError('Vui lòng nhập tên nhà cung cấp.')
      valid = false
    } else {
      setNameError('')
    }

    if (!soluong) {
      setsoluongError('Vui lòng nhập số lượng.')
      valid = false
    } else {
      setsoluongError('')
    }

    if (!tongtien) {
      settongtienError('Vui lòng nhập tổng tiền.')
      valid = false
    } else {
      settongtienError('')
    }

    if (!date) {
      setdateError('Vui lòng nhập ngày nhập lô hàng.')
      valid = false
    } else {
      setdateError('')
    }

    if (!mancc) {
      setmanccError('Vui lòng chọn mã nhà cung cấp.')
      valid = false
    } else {
      setmanccError('')
    }

    return valid
  }

  const handleAddLoHang = async () => {
    if (validateInputs()) {
      try {
        const response = await fetch(
          `https://www.ansuataohanoi.com/postloaisanpham2`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              mancc: mancc,
              name: name,
              tongtien: tongtien,
              soluong: soluong,
              date: date
            })
          }
        )
        const data = await response.json()

        if (response.ok) {
          setlohang(prevlohang => [...prevlohang, data])
          handleClose()
          showToast('Thêm lô hàng thành công')
        } else {
          showToast('Thêm lô hàng thất bại', 'error')
        }
      } catch (error) {
        console.error('Lỗi khi gửi yêu cầu thêm lô hàng:', error)
        showToast('Thêm lô hàng thất bại', 'error')
        handleClose()
      }
    }
  }

  const resetForm = useCallback(() => {
    setName('')
    setsoluong('')
    settongtien('')
    setdate('')
    setmancc('')
    setNameError('')
    setsoluongError('')
    settongtienError('')
    setdateError('')
    setmanccError('')
  }, [])

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className='divAddLoHang'>
        <h2>Thêm lô hàng</h2>

        <div className='divinputncc'>
          <h4>Nhà cung cấp</h4>
          <button
            className='divChonncc'
            onMouseEnter={() => setIsTableVisible(true)} // Hiển thị bảng khi hover vào

          >
            {mancc ? `${mancc}` : 'Chọn nhà cung cấp'}
            <FontAwesomeIcon icon={faChevronDown} className='iconNcc' />
          </button>
        </div>

        {manccError && <div className='error'>{manccError}</div>}

        {/* Hiển thị bảng nhà cung cấp */}
        {isTableVisible && (
          <div className='supplier-table-container'>
            {loadingSuppliers ? (
              <p>Đang tải danh sách nhà cung cấp...</p>
            ) : (
              <table className='supplier-info-table'>
                <thead>
                  <tr>
                    <th>Mã nhà cung cấp</th>
                    <th>Tên nhà cung cấp</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map(supplier => (
                    <tr
                      key={supplier.id}
                      onClick={() => {
                        setmancc(supplier.mancc)
                        setIsTableVisible(false) // Đóng bảng sau khi chọn nhà cung cấp
                      }}
                    >
                      <td>{supplier.mancc}</td>
                      <td>{supplier.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Các trường nhập khác */}
        <div className='divtenkho'>
          <input
            type='text'
            className={`tenkho ${nameError ? 'input-error' : ''}`}
            placeholder=''
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <label htmlFor='' className='label'>
            Nhập tên lô hàng
          </label>
        </div>
        {nameError && <div className='error'>{nameError}</div>}

        <div className='divdiachikho'>
          <input
            type='text'
            className={`diachi ${soluongError ? 'input-error' : ''}`}
            placeholder=''
            value={soluong}
            onChange={e => setsoluong(e.target.value)}
          />
          <label htmlFor='' className='label'>
            Nhập số lượng máy
          </label>
        </div>
        {soluongError && <div className='error'>{soluongError}</div>}

        <div className='divdiachikho'>
          <input
            type='text'
            className={`diachi ${tongtienError ? 'input-error' : ''}`}
            placeholder=''
            value={tongtien}
            onChange={e => settongtien(e.target.value)}
          />
          <label htmlFor='' className='label'>
            Nhập tổng tiền lô hàng
          </label>
        </div>
        {tongtienError && <div className='error'>{tongtienError}</div>}

        <div className='divdiachikho'>
          <input
            type='text'
            className={`diachi ${dateError ? 'input-error' : ''}`}
            placeholder=''
            value={date}
            onChange={e => setdate(e.target.value)}
          />
          <label htmlFor='' className='label'>
            Ngày nhập dd/mm/yyyy
          </label>
        </div>
        {dateError && <div className='error'>{dateError}</div>}

        <button onClick={handleAddLoHang} className='btnAddLoHang'>
          Thêm lô hàng
        </button>
        <button onClick={handleClose} className='btnhuyAddLoHang'>
          Hủy
        </button>
      </div>
    </Modal>
  )
}
export default AddLoHang
