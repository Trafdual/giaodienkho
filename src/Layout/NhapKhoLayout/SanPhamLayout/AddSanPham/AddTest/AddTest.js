/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useEffect, useRef } from 'react'
import { useToast } from '../../../../../components/GlobalStyles/ToastContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faPlus } from '@fortawesome/free-solid-svg-icons'
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
import { getFromLocalStorage } from '~/components/MaHoaLocalStorage/MaHoaLocalStorage'
import Tippy from '@tippyjs/react/headless'
import { getApiUrl } from '../../../../../api/api'

function AddTest ({ isOpen, onClose, fetclohang, malohang }) {
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
  const [isTableNgay, setIsTableNgay] = useState(false)
  const [isTableTime, setisTableTime] = useState(false)

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
  const [userID, setuserID] = useState(getFromLocalStorage('userId') || '')

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false)
  const [payment, setpayment] = useState('')
  const methods = ['Tiền mặt', 'Chuyển khoản']
  const loaihanghoas = ['Linh kiện', 'Điện thoại']
  const [loaihanghoa, setloaihanghoa] = useState('Điện thoại')
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
    const intervalId = setInterval(() => {
      const newuserID = getFromLocalStorage('userId') || ''
      if (newuserID !== userID) {
        console.log('Interval detected change, updating khoID:', newuserID)
        setuserID(newuserID)
      }
    }, 1000) // Kiểm tra mỗi giây

    return () => clearInterval(intervalId)
  }, [getFromLocalStorage('userId')])

  const fetchSuppliers = async () => {
    try {
      const response = await fetch(
        `${getApiUrl('domain')}/getnhacungcap/${khoID}`
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
    if (khoID) {
      fetchSuppliers()
    }
  }, [khoID, showToast])
  const fetchnganhang = async () => {
    try {
      const response = await fetch(
        `${getApiUrl('domain')}/getnganhang/${userID}`
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
    const currentDate = new Date()

    setdate(currentDate)
    setpayment('ghino')
  }, [])

  const resetForm = useCallback(() => {
    setName('')
    setmancc('')
    setloaihanghoa('Điện thoại')
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
    setIsDatePickerOpen(false)
  }

  const handleTimeChange = newTime => {
    if (newTime !== time) {
      settime(newTime)
    }
  }

  const validateInputs = () => {
    let valid = true

    if (!name) {
      setNameError('Vui lòng nhập diễn giải.')
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
        <div className='div_malo'>
          <h4>Mã lô hàng:</h4>
          <p>{malohang}</p>
        </div>
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
          <div className='divttntong'>
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
              <Tippy
                interactive
                arrow
                visible={isTableMethod}
                placement='bottom'
                onClickOutside={() => setIsTableNganHang(false)}
                render={() => (
                  <div
                    className={`supplier-table-container ${
                      isTableMethod ? 'fade-in' : 'fade-out'
                    }`}
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
                )}
              >
                <button
                  className='divChonncc'
                  disabled={payment !== 'thanhtoanngay'}
                  onClick={() => setIsTableMethod(!isTableMethod)}
                >
                  {method ? `${method}` : 'Chọn phương thức'}
                  <FontAwesomeIcon icon={faChevronDown} className='iconNcc' />
                </button>
              </Tippy>
            </div>
          </div>
        </div>

        <div className='divinputncc'>
          <h4>Loại hàng hóa</h4>
          <Tippy
            visible={isTableHangHoa}
            interactive
            arrow
            placement='bottom'
            onClickOutside={() => setIsTableHangHoa(false)}
            render={() => (
              <div
                className={`supplier-table-container ${
                  isTableHangHoa ? 'fade-in' : 'fade-out'
                }`}
              >
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
            )}
          >
            <button
              className='divChonncc'
              onClick={() => setIsTableHangHoa(!isTableHangHoa)}
            >
              {loaihanghoa ? `${loaihanghoa}` : 'Chọn loại hàng hóa'}
              <FontAwesomeIcon icon={faChevronDown} className='iconNcc' />
            </button>
          </Tippy>
        </div>

        {loaihanghoaError && <div className='error'>{loaihanghoaError}</div>}

        <div className='divinputncc'>
          <h4>Nhà cung cấp</h4>
          <Tippy
            visible={isTableVisible}
            interactive
            arrow
            placement='bottom'
            onClickOutside={() => setIsTableVisible(false)}
            render={() => (
              <div
                className={`supplier-table-container ${
                  isTableVisible ? 'fade-in' : 'fade-out'
                }`}
              >
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
                      {suppliers.length > 0 ? (
                        suppliers.map(supplier => (
                          <tr
                            className='trdulieu'
                            key={supplier.id}
                            onClick={() => {
                              setmancc(supplier.mancc)
                              setIsTableVisible(false)
                              setmanccError('')
                            }}
                          >
                            <td>{supplier.mancc}</td>
                            <td>{supplier.name}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={2} style={{ textAlign: 'center' }}>
                            Không có dữ liệu
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          >
            <button
              className='divChonncc'
              onClick={() => setIsTableVisible(!isTableVisible)}
            >
              {mancc ? `${mancc}` : 'Chọn nhà cung cấp'}
              <FontAwesomeIcon icon={faChevronDown} className='iconNcc' />
            </button>
          </Tippy>
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
            <Tippy
              visible={isTableNganHang}
              arrow
              placement='bottom'
              onClickOutside={() => setIsTableNganHang(false)}
              render={() => (
                <div
                  className={`supplier-table-container ${
                    isTableNganHang ? 'fade-in' : 'fade-out'
                  }`}
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
              )}
            >
              <button
                className='divChonncc'
                onClick={() => setIsTableNganHang(!isTableNganHang)}
              >
                {manganhang ? `${manganhang}` : 'Chọn ngân hàng'}
                <FontAwesomeIcon icon={faChevronDown} className='iconNcc' />
              </button>
            </Tippy>
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
          <Tippy
            visible={isDatePickerOpen}
            interactive
            arrow
            onMount={() => setTimeout(() => setIsDatePickerOpen(true), 0)}
            onClickOutside={() => {
              setIsTableNgay(false)
              setTimeout(() => {
                setIsDatePickerOpen(false)
              }, 300)
            }}
            render={() => (
              <div className={`${isTableNgay ? 'fade-in' : 'fade-out'}`}>
                <DatePicker
                  selected={date}
                  onChange={handleDateChange}
                  dateFormat='dd/MM/yyyy'
                  inline
                />
              </div>
            )}
          >
            <div
              className='divdate'
              onClick={() => {
                setIsDatePickerOpen(!isDatePickerOpen)
                setIsTableNgay(true)
              }}
            >
              <input
                type='text'
                className={`diachi`}
                placeholder='dd/mm/yyyy'
                value={
                  date
                    ? date.toLocaleDateString('vi-VN')
                    : new Date(Date.now()).toLocaleDateString('vi-VN')
                }
                readOnly
              />
              <label htmlFor='' className='label'>
                Ngày nhập
              </label>
            </div>
          </Tippy>
          <Tippy
            visible={isTimePickerOpen}
            interactive
            arrow
            onMount={() => setTimeout(() => setIsTimePickerOpen(true), 0)}
            onClickOutside={() => {
              setisTableTime(false)
              setTimeout(() => {
                setIsTimePickerOpen(false)
              }, 300)
            }}
            position='top'
            render={() => (
              <div className={`${isTableTime ? 'fade-in' : 'fade-out'}`}>
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
            )}
          >
            <div
              className='divhour'
              onClick={() => {
                setIsTimePickerOpen(!isTimePickerOpen)
                setisTableTime(true)
              }}
            >
              <input
                type='text'
                className={`diachi`}
                placeholder='HH:mm'
                value={time.toLocaleTimeString('en-GB', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
                readOnly
              />
              <label htmlFor='' className='label'>
                Giờ nhập
              </label>
            </div>
          </Tippy>
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
            malohang={malohang}
          />
        </div>
      </div>
    </ModalBig>
  )
}

export default AddTest
