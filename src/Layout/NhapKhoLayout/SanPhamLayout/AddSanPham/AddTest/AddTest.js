/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useEffect, useRef } from 'react'
import { useToast } from '../../../../../components/GlobalStyles/ToastContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faPlus } from '@fortawesome/free-solid-svg-icons'
import { Tooltip } from 'react-tippy'
import 'react-tippy/dist/tippy.css'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-time-picker/dist/TimePicker.css'
import 'react-clock/dist/Clock.css'
import AddTest2 from './AddTest2'
import { ModalBig } from '~/components/ModalBig'
import './AddTest.scss'
import { ModalAddNganHang } from '~/Layout/NhapKhoLayout/AddLoHang/ModalAddNganHang'
import { ModalAddNhaCungCap } from '~/Layout/NhapKhoLayout/ModalAddNhaCungCap'

function AddTest ({ isOpen, onClose, fetclohang }) {
  const [name, setName] = useState('')
  const [date, setdate] = useState('')
  const [time, settime] = useState(new Date())
  const [isOpenAddNH, setisOpenAddNH] = useState(false)
  const [isOpenAddNcc, setisOpenAddNcc] = useState(false)

  const [mancc, setmancc] = useState('')
  const [isTableVisible, setIsTableVisible] = useState(false)
  const [isTableMethod, setIsTableMethod] = useState(false)
  const [isTableNganHang, setIsTableNganHang] = useState(false)
  const [isTableHangHoa, setIsTableHangHoa] = useState(false)

  const [nganhangs, setnganhangs] = useState([])
  const [manganhang, setmanganhang] = useState('')

  const { showToast } = useToast()
  const [nameError, setNameError] = useState('')
  const [dateError, setdateError] = useState('')
  const [manccError, setmanccError] = useState('')
  const [loaihanghoaError, setloaihanghoaError] = useState('')
  const [isModalHuy, setIsModalHuy] = useState(false)

  const [suppliers, setSuppliers] = useState([])
  const [loadingSuppliers, setLoadingSuppliers] = useState(true)
  const [khoID, setKhoID] = useState(localStorage.getItem('khoID') || '')
  const [userID, setuserID] = useState(localStorage.getItem('userId') || '')

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false)
  const [payment, setpayment] = useState('')
  const methods = ['Tiền mặt', 'Chuyển khoản']
  const loaihanghoas = ['Linh kiện', 'Điện thoại']
  const [loaihanghoa, setloaihanghoa] = useState('')
  const [method, setmethod] = useState('')
  const tooltipRefMethod = useRef(null)
  const tooltipRefHangHoa = useRef(null)
  const tooltipRefNcc = useRef(null)
  const tooltipRefDate = useRef(null)
  const tooltipRefTime = useRef(null)
  const tooltipRefNganHang = useRef(null)

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
    const handleClickOutside = event => {
      if (
        tooltipRefMethod.current &&
        !tooltipRefMethod.current.contains(event.target)
      ) {
        setIsTableMethod(false)
      }
      if (
        tooltipRefHangHoa.current &&
        !tooltipRefHangHoa.current.contains(event.target)
      ) {
        setIsTableHangHoa(false)
      }
      if (
        tooltipRefNcc.current &&
        !tooltipRefNcc.current.contains(event.target)
      ) {
        setIsTableVisible(false)
      }
      if (
        tooltipRefDate.current &&
        !tooltipRefDate.current.contains(event.target)
      ) {
        setIsDatePickerOpen(false)
      }
      if (
        tooltipRefTime.current &&
        !tooltipRefTime.current.contains(event.target)
      ) {
        setIsTimePickerOpen(false)
      }
      if (
        tooltipRefNganHang.current &&
        !tooltipRefNganHang.current.contains(event.target)
      ) {
        setIsTableNganHang(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

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

  useEffect(() => {
    fetchSuppliers()
  }, [khoID, showToast])
  const fetchnganhang = async () => {
    try {
      const response = await fetch(
        `https://www.ansuataohanoi.com/getnganhang/${userID}`
      )
      const data = await response.json()

      if (response.ok) {
        setnganhangs(data)
      } else {
        showToast('Không thể tải danh sách ngân hàng', 'error')
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu ngân hàng:', error)
      showToast('Không thể tải danh sách ngân hàng', 'error')
    } finally {
      setLoadingSuppliers(false)
    }
  }

  useEffect(() => {
    fetchnganhang()
  }, [userID, showToast])

  useEffect(() => {
    // Khi modal mở, thiết lập ngày và giờ hiện tại
    const currentDate = new Date()

    setdate(currentDate)
    setpayment('ghino')
  }, []) // Chỉ thực thi khi modal được mở

  const resetForm = useCallback(() => {
    setName('')
    setmancc('')
    setloaihanghoa('')
    setNameError('')
    setdateError('')
    setmanccError('')
    setloaihanghoaError('')
  }, [])

  const handleClose = () => {
    setIsModalHuy(true)
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

  const validateInputs = () => {
    let valid = true

    if (!name) {
      setNameError('Vui lòng nhập tên nhà cung cấp.')
      valid = false
      setIsModalHuy(false)
    } else {
      setNameError('')
    }

    if (!date) {
      setdateError('Vui lòng nhập ngày nhập lô hàng.')
      valid = false
      setIsModalHuy(false)
    } else {
      setdateError('')
    }

    if (!mancc) {
      setmanccError('Vui lòng chọn mã nhà cung cấp.')
      valid = false
      setIsModalHuy(false)
    } else {
      setmanccError('')
    }
    if (!loaihanghoa) {
      setloaihanghoaError('Vui lòng chọn loại hàng hóa.')
      valid = false
      setIsModalHuy(false)
    } else {
      setloaihanghoaError('')
    }

    return valid
  }

  return (
    <ModalBig isOpen={isOpen} onClose={handleClose}>
      <div className='divAddLoHang'>
        <h2>Thêm lô hàng</h2>
        <div className='divphuongthuc'>
          <div className='divghino'>
            <input
              type='radio'
              name='paymentMethod'
              id='ghino'
              value='ghino'
              onChange={e => setpayment(e.target.value)}
              checked={payment === 'ghino'}
            />
            <label htmlFor='ghino'>Ghi nợ nhà cung cấp</label>
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
                <div
                  className='supplier-table-container'
                  ref={tooltipRefMethod}
                >
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
          <h4>Loại hàng hóa</h4>
          <Tooltip
            trigger='click'
            interactive
            arrow
            position='bottom'
            open={isTableHangHoa}
            onRequestClose={() => setIsTableHangHoa(false)}
            html={
              <div className='supplier-table-container' ref={tooltipRefHangHoa}>
                <table className='supplier-info-table'>
                  <thead>
                    <tr>
                      <th>Loại hàng hóa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loaihanghoas.map((hanghoa, index) => (
                      <tr
                        className='trdulieu'
                        key={index}
                        onClick={() => {
                          setloaihanghoa(hanghoa)
                          setIsTableHangHoa(false)
                          setloaihanghoaError('')
                        }}
                      >
                        <td>{hanghoa}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            }
          >
            <button
              className='divChonncc'
              onClick={() => setIsTableHangHoa(!isTableHangHoa)}
            >
              {loaihanghoa ? `${loaihanghoa}` : 'Chọn loại hàng hóa'}
              <FontAwesomeIcon icon={faChevronDown} className='iconNcc' />
            </button>
          </Tooltip>
        </div>
        {loaihanghoaError && <div className='error'>{loaihanghoaError}</div>}

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
              <div className='supplier-table-container' ref={tooltipRefNcc}>
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
          <button className='btnadd' onClick={() => setisOpenAddNcc(true)}>
            <FontAwesomeIcon icon={faPlus} className='icon' />
          </button>
          <ModalAddNhaCungCap
            isOpen={isOpenAddNcc}
            onClose={() => setisOpenAddNcc(false)}
            khoID={khoID}
            fetchnhacungcap={fetchSuppliers}
          />
        </div>
        {method === 'Chuyển khoản' && (
          <div className='divinputncc'>
            <h4>Ngân hàng</h4>
            <Tooltip
              trigger='click'
              interactive
              arrow
              position='bottom'
              open={isTableNganHang}
              onRequestClose={() => setIsTableNganHang(false)}
              html={
                <div
                  className='supplier-table-container'
                  ref={tooltipRefNganHang}
                >
                  {loadingSuppliers ? (
                    <p>Đang tải danh sách ngân hàng...</p>
                  ) : (
                    <table className='supplier-info-table'>
                      <thead>
                        <tr>
                          <th>Mã Ngân Hàng</th>
                          <th>Ngân Hàng</th>
                          <th>Số Tài Khoản</th>
                          <th>Chủ Sở Hữu</th>
                        </tr>
                      </thead>
                      <tbody>
                        {nganhangs.length > 0 ? (
                          nganhangs.map(supplier => (
                            <tr
                              className='trdulieu'
                              key={supplier._id}
                              onClick={() => {
                                setmanganhang(supplier.manganhangkho)
                                setIsTableNganHang(false)
                              }}
                            >
                              <td>{supplier.manganhangkho}</td>
                              <td>{supplier.name}</td>
                              <td>{supplier.sotaikhoan}</td>
                              <td>{supplier.chusohuu}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td style={{ textAlign: 'center' }} colSpan='4'>
                              Không có ngân hàng nào
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              }
            >
              <button
                className='divChonncc'
                onClick={() => setIsTableNganHang(!isTableNganHang)}
              >
                {manganhang ? `${manganhang}` : 'Chọn ngân hàng'}
                <FontAwesomeIcon icon={faChevronDown} className='iconNcc' />
              </button>
            </Tooltip>
            <button className='btnadd'>
              <FontAwesomeIcon
                icon={faPlus}
                className='icon'
                onClick={() => setisOpenAddNH(true)}
              />
            </button>
            <ModalAddNganHang
              isOpen={isOpenAddNH}
              onClose={() => setisOpenAddNH(false)}
              userId={userID}
              fetchdata={fetchnganhang}
            />
          </div>
        )}
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
              <div ref={tooltipRefDate}>
                <DatePicker
                  selected={date}
                  onChange={handleDateChange}
                  dateFormat='dd/MM/yyyy'
                  inline // Hiển thị lịch bên trong Tooltip
                />
              </div>
            }
          >
            <div className='divdate'>
              <input
                type='text'
                className={`diachi`}
                placeholder='dd/mm/yyyy'
                value={date ? date.toLocaleDateString('vi-VN') : new Date(Date.now()).toLocaleDateString('vi-VN')}
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
              <div ref={tooltipRefTime}>
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
              </div>
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
        <div style={{ marginTop: '10px' }}>
          <AddTest2
            fetchlohang={fetclohang}
            mancc={mancc}
            name={name}
            date={date}
            ghino={payment}
            method={method}
            hour={time}
            manganhangkho={manganhang}
            loaihanghoa={loaihanghoa}
            onClose={onClose}
            iscloseHuy={isModalHuy}
            setIsCloseHuy={setIsModalHuy}
            validateInputs={validateInputs}
            resetForm={resetForm}
          />
        </div>
      </div>
    </ModalBig>
  )
}

export default AddTest
