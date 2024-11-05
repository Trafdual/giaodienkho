/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useEffect } from 'react'
import { Modal } from '../../../components/Modal'
import { useToast } from '../../../components/GlobalStyles/ToastContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faPlus } from '@fortawesome/free-solid-svg-icons'
import { Tooltip } from 'react-tippy'
import 'react-tippy/dist/tippy.css'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-time-picker/dist/TimePicker.css'
import 'react-clock/dist/Clock.css'

function ModalTraHang ({ isOpen, onClose, fetchData, imellist }) {
  const [name, setName] = useState('')
  const [date, setdate] = useState('')
  const [time, settime] = useState(new Date())

  const [mancc, setmancc] = useState('')
  const [isTableVisible, setIsTableVisible] = useState(false)
  const [isTableMethod, setIsTableMethod] = useState(false)

  const { showToast } = useToast()
  const [nameError, setNameError] = useState('')
  const [dateError, setdateError] = useState('')
  const [manccError, setmanccError] = useState('')

  const [suppliers, setSuppliers] = useState([])
  const [loadingSuppliers, setLoadingSuppliers] = useState(true)
  const [khoID, setKhoID] = useState(localStorage.getItem('khoID') || '')
  const [userID, setuserID] = useState(localStorage.getItem('userId') || '')

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false)
  const [payment, setpayment] = useState('')
  const methods = ['Tiền mặt', 'Chuyển khoản']
  const [method, setmethod] = useState('')
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
      const newuserID = localStorage.getItem('userId') || ''
      if (newuserID !== userID) {
        console.log('Interval detected change, updating khoID:', newuserID)
        setuserID(newuserID)
      }
    }, 1000) // Kiểm tra mỗi giây

    return () => clearInterval(intervalId)
  }, [localStorage.getItem('userId')])

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch(
          `https://www.ansuataohanoi.com/getnhacungcap/${khoID}`
        )
        const data = await response.json()

        if (response.ok) {
          setSuppliers(data)
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

  useEffect(() => {
    if (isOpen) {
      // Khi modal mở, thiết lập ngày và giờ hiện tại
      const currentDate = new Date()

      setdate(currentDate)
      setpayment('congno')
    }
  }, [isOpen]) // Chỉ thực thi khi modal được mở

  const validateInputs = () => {
    let valid = true

    if (!name) {
      setNameError('Vui lòng nhập tên nhà cung cấp.')
      valid = false
    } else {
      setNameError('')
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

  const handleModalTraHang = async () => {
    const imelsp = imellist.map(item => item.imel)

    if (validateInputs()) {
      try {
        const response = await fetch(
          `http://localhost:8080/posttrahang/${khoID}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              manhacungcap: mancc,
              diengiai: name,
              ngaynhap: date,
              congno: payment,
              method: method,
              hour: time,
              imelist: imelsp
            })
          }
        )
        const data = await response.json()

        if (data.message) {
          showToast(`trả lại hàng thất bại${data.message}`, 'error')
        } else {
          fetchData()
          handleClose()
          showToast('trả lại hàng thành công')
        }
      } catch (error) {
        console.error('Lỗi khi gửi yêu cầu trả lại hàng:', error)
        showToast(`trả lại hàng thất bại${error}`, 'error')
        handleClose()
      }
    }
  }

  const resetForm = useCallback(() => {
    setName('')
    setdate('')
    setmancc('')
    setNameError('')
    setdateError('')
    setmanccError('')
  }, [])

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleDateChange = selectedDate => {
    setdate(selectedDate)
    setIsDatePickerOpen(false) // Ẩn DatePicker khi chọn xong
  }

  const handleTimeChange = newTime => {
    // Chỉ đóng tooltip nếu có thay đổi giá trị
    if (newTime !== time) {
      settime(newTime)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className='divAddLoHang'>
        <h2>Trả lại hàng</h2>
        <div className='divphuongthuc'>
          <div className='divghino'>
            <input
              type='radio'
              name='paymentMethod'
              id='congno'
              value='congno'
              onChange={e => setpayment(e.target.value)}
              checked={payment === 'congno'}
            />
            <label htmlFor='congno'>Giảm trừ công nợ</label>
          </div>
          <div className='divthanhtoanngay'>
            <input
              type='radio'
              name='paymentMethod'
              id='thanhtoanngay'
              value='thanhtoanngay'
              onChange={e => setpayment(e.target.value)}
              checked={payment === 'thanhtoanngay'}
            />
            <label htmlFor='thanhtoanngay'>Thanh toán ngay</label>
          </div>
          <div className='divinputmethod'>
            <Tooltip
              trigger='click'
              interactive
              arrow
              position='bottom'
              open={isTableMethod}
              onRequestClose={() => setIsTableMethod(false)}
              html={
                <div className='supplier-table-container'>
                  <table className='supplier-info-table'>
                    <thead>
                      <tr>
                        <th>Phương thức</th>
                      </tr>
                    </thead>
                    <tbody>
                      {methods.map((paymentMethod, index) => (
                        <tr
                          className='trdulieu'
                          key={index}
                          onClick={() => {
                            setmethod(paymentMethod)
                            setIsTableMethod(false)
                          }}
                        >
                          <td>{paymentMethod}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              }
            >
              <button
                className='divChonncc'
                onClick={() => setIsTableMethod(!isTableMethod)}
                disabled={payment !== 'thanhtoanngay'}
              >
                {method ? `${method}` : 'Chọn phương thức'}
                <FontAwesomeIcon icon={faChevronDown} className='iconNcc' />
              </button>
            </Tooltip>
          </div>
        </div>

        <div className='divinputncc'>
          <h4>Nhà cung cấp</h4>
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
                          className='trdulieu'
                          key={supplier.id}
                          onClick={() => {
                            setmancc(supplier.mancc)
                            setIsTableVisible(false)
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
            }
          >
            <button
              className='divChonncc'
              onClick={() => setIsTableVisible(!isTableVisible)}
            >
              {mancc ? `${mancc}` : 'Chọn nhà cung cấp'}
              <FontAwesomeIcon icon={faChevronDown} className='iconNcc' />
            </button>
          </Tooltip>
        </div>
        {manccError && <div className='error'>{manccError}</div>}
        <div className='divtenkho'>
          <input
            type='text'
            className={`tenkho ${nameError ? 'input-error' : ''}`}
            placeholder=''
            value={name}
            onChange={e => {
              setName(e.target.value)
              if (e.target.value) {
                setNameError('')
              }
            }}
          />
          <label htmlFor='' className='label'>
            Diễn giải
          </label>
        </div>
        {nameError && <div className='error'>{nameError}</div>}
        <div className='divngaygio'>
          {/* Input cho ngày */}
          <Tooltip
            trigger='click'
            interactive
            arrow
            open={isDatePickerOpen}
            onRequestClose={() => setIsDatePickerOpen(false)}
            html={
              <DatePicker
                selected={date}
                onChange={handleDateChange}
                dateFormat='dd/MM/yyyy'
                inline // Hiển thị lịch bên trong Tooltip
              />
            }
          >
            <div className='divdate'>
              <input
                type='text'
                className={`diachi`}
                placeholder='dd/mm/yyyy'
                value={date ? date.toLocaleDateString('vi-VN') : ''}
                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                readOnly // Để ngăn người dùng tự sửa input mà chỉ dùng DatePicker
              />
              <label htmlFor='' className='label'>
                Ngày nhập
              </label>
            </div>
          </Tooltip>
          <Tooltip
            trigger='click'
            interactive
            arrow
            open={isTimePickerOpen}
            onRequestClose={() => setIsTimePickerOpen(false)}
            position='top'
            html={
              <DatePicker
                selected={time}
                onChange={handleTimeChange}
                showTimeSelect
                timeIntervals={1}
                showTimeSelectOnly
                timeCaption='Thời gian'
                dateFormat='HH:mm'
                placeholderText='Chọn giờ'
              />
            }
          >
            <div className='divhour'>
              <input
                type='text'
                className={`diachi`}
                placeholder='HH:mm'
                value={time.toLocaleTimeString('en-GB', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
                onClick={() => setIsTimePickerOpen(!isTimePickerOpen)}
                readOnly
              />
              <label htmlFor='' className='label'>
                Giờ nhập
              </label>
            </div>
          </Tooltip>
        </div>
        <button onClick={handleModalTraHang} className='btnAddLoHang'>
          Trả lại hàng
        </button>
        <button onClick={handleClose} className='btnhuyAddLoHang'>
          Hủy
        </button>
      </div>
    </Modal>
  )
}

export default ModalTraHang
