/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useEffect, useRef } from 'react'
import { useToast } from '~/components/GlobalStyles/ToastContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faPlus } from '@fortawesome/free-solid-svg-icons'
import { Tooltip } from 'react-tippy'
import 'react-tippy/dist/tippy.css'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-time-picker/dist/TimePicker.css'
import 'react-clock/dist/Clock.css'
import AddQuyTien2 from './AddQuyTien2'
import { ModalBig } from '~/components/ModalBig'
import { ModalAddNhaCungCap } from '~/Layout/NhapKhoLayout/ModalAddNhaCungCap'
import { getFromLocalStorage } from '~/components/MaHoaLocalStorage/MaHoaLocalStorage'
import { AddLoaiChungTu } from './AddLoaiChungTu'

function AddQuyTien ({ isOpen, onClose, fetchquytien, loaitien, method }) {
  const [lydo, setlydo] = useState('')
  const [date, setdate] = useState('')
  const [isOpenAddNcc, setisOpenAddNcc] = useState(false)

  const [mancc, setmancc] = useState('')
  const [isTableVisible, setIsTableVisible] = useState(false)
  const [isTableloaichungtu, setIsTableloaichungtu] = useState(false)

  const { showToast } = useToast()
  const [lydoError, setlydoError] = useState('')
  const [dateError, setdateError] = useState('')
  const [manccError, setmanccError] = useState('')
  const [loaichungtuError, setloaichungtuError] = useState('')
  const [isModalHuy, setIsModalHuy] = useState(false)
  const [isOpenModalAddLct, setIsOpenModalAddLct] = useState(false)

  const [suppliers, setSuppliers] = useState({ nhacungcap: [], khachhang: [] })
  const [loadingSuppliers, setLoadingSuppliers] = useState(true)
  const [khoID, setKhoID] = useState(localStorage.getItem('khoID') || '')
  const [userID, setuserID] = useState(getFromLocalStorage('userId') || '')

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [loaichungtus, setloaichungtus] = useState([])
  const [loaichungtu, setloaichungtu] = useState('')

  const tooltipRefloaichungtu = useRef(null)
  const tooltipRefNcc = useRef(null)
  const tooltipRefDate = useRef(null)
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
        tooltipRefloaichungtu.current &&
        !tooltipRefloaichungtu.current.contains(event.target)
      ) {
        setIsTableloaichungtu(false)
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
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

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
        `https://ansuataohanoi.com/doituongthuchi/${khoID}`
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
  console.log(suppliers)

  const fetchLoaichungtu = async () => {
    try {
      const response = await fetch(
        `https://ansuataohanoi.com/getloaichungtu/${userID}`
      )
      const data = await response.json()

      if (response.ok) {
        setloaichungtus(data)
      } else {
        showToast('Không thể tải danh sách loại chứng từ', 'error')
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu loại chứng từ:', error)
      showToast('Không thể tải danh sách loại chứng từ', 'error')
    } finally {
      setLoadingSuppliers(false)
    }
  }

  useEffect(() => {
    fetchLoaichungtu()
  }, [userID, showToast])

  useEffect(() => {
    fetchSuppliers()
  }, [khoID, showToast])

  useEffect(() => {
    // Khi modal mở, thiết lập ngày và giờ hiện tại
    const currentDate = new Date()

    setdate(currentDate)
  }, [])

  const resetForm = useCallback(() => {
    setlydo('')
    setmancc('')
    setloaichungtu('')
    setlydoError('')
    setdateError('')
    setmanccError('')
    setloaichungtuError('')
  }, [])

  const handleClose = () => {
    setIsModalHuy(true)
  }

  const handleDateChange = selectedDate => {
    setdate(selectedDate)
    setIsDatePickerOpen(false) // Ẩn DatePicker khi chọn xong
  }

  const validateInputs = () => {
    let valid = true

    if (!lydo) {
      setlydoError('Vui lòng nhập lý do.')
      valid = false
      setIsModalHuy(false)
    } else {
      setlydoError('')
    }

    if (!date) {
      setdateError('Vui lòng nhập ngày tháng.')
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
    if (!loaichungtu) {
      setloaichungtuError('Vui lòng chọn loại chứng từ.')
      valid = false
      setIsModalHuy(false)
    } else {
      setloaichungtuError('')
    }

    return valid
  }

  return (
    <ModalBig isOpen={isOpen} onClose={handleClose}>
      <div className='divAddLoHang'>
        <h2>Thêm {loaitien}</h2>
        <div className='divinputncc'>
          <h4>Loại chứng từ</h4>
          <Tooltip
            trigger='click'
            interactive
            arrow
            position='bottom'
            open={isTableloaichungtu}
            onRequestClose={() => setIsTableloaichungtu(false)}
            html={
              <div
                className='supplier-table-container'
                ref={tooltipRefloaichungtu}
              >
                <table className='supplier-info-table'>
                  <thead>
                    <tr>
                      <th>Loại chứng từ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loaichungtus.length > 0 ? (
                      loaichungtus
                        .filter(lct => lct.method === method)
                        .map((lct, index) => (
                          <tr
                            className='trdulieu'
                            key={index}
                            onClick={() => {
                              setloaichungtu(lct.maloaict)
                              setIsTableloaichungtu(false)
                              setloaichungtuError('')
                            }}
                          >
                            <td>
                              {lct.name} - {lct.method}
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td
                          colSpan={1}
                          style={{ textAlign: 'center', padding: '10px' }}
                        >
                          Không có loại chứng từ
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            }
          >
            <button
              className='divChonncc'
              onClick={() => setIsTableloaichungtu(!isTableloaichungtu)}
            >
              {loaichungtu ? `${loaichungtu}` : 'Chọn loại chứng từ'}
              <FontAwesomeIcon icon={faChevronDown} className='iconNcc' />
            </button>
          </Tooltip>
          <button className='btnadd' onClick={() => setIsOpenModalAddLct(true)}>
            <FontAwesomeIcon icon={faPlus} className='icon' />
          </button>
          <AddLoaiChungTu
            isOpen={isOpenModalAddLct}
            onClose={() => setIsOpenModalAddLct(false)}
            fetchdata={fetchLoaichungtu}
            userID={userID}
          />
        </div>
        {loaichungtuError && <div className='error'>{loaichungtuError}</div>}

        <div className='divinputncc'>
          <h4>Đối tượng</h4>
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
                  <p>Đang tải danh sách đối tượng...</p>
                ) : (
                  <table className='supplier-info-table'>
                    <thead>
                      <tr>
                        <th>Mã</th>
                        <th>Tên</th>
                      </tr>
                    </thead>
                    <tbody>
                      {suppliers?.nhacungcap.map(supplier => (
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
                      ))}
                      {suppliers?.khachhang.map(supplier => (
                        <tr
                          className='trdulieu'
                          key={supplier.id}
                          onClick={() => {
                            setmancc(supplier.makh)
                            setIsTableVisible(false)
                            setmanccError('')
                          }}
                        >
                          <td>{supplier.makh}</td>
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
              {mancc ? `${mancc}` : 'Chọn đối tượng'}
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
        {manccError && <div className='error'>{manccError}</div>}
        <div className='divtenkho'>
          <input
            type='text'
            className={`tenkho ${lydoError ? 'input-error' : ''}`}
            placeholder=''
            value={lydo}
            onChange={e => {
              setlydo(e.target.value)
              if (e.target.value) {
                setlydoError('')
              }
            }}
          />
          <label htmlFor='' className='label'>
            Lý do
          </label>
        </div>
        {lydoError && <div className='error'>{lydoError}</div>}

        <div className='divngaygio'>
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
                  inline
                />
              </div>
            }
          >
            <div className='divdate'>
              <input
                type='text'
                className={`diachi`}
                placeholder='dd/mm/yyyy'
                value={
                  date
                    ? date.toLocaleDateString('vi-VN')
                    : new Date(Date.now()).toLocaleDateString('vi-VN')
                }
                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                readOnly
              />
              <label htmlFor='' className='label'>
                Ngày
              </label>
            </div>
          </Tooltip>
        </div>
        <div style={{ marginTop: '10px' }}>
          <AddQuyTien2
            fetchquytien={fetchquytien}
            mancc={mancc}
            lydo={lydo}
            loaichungtu={loaichungtu}
            date={date}
            method={method}
            loaitien={loaitien}
            depotid={khoID}
            onClose={onClose}
            iscloseHuy={isModalHuy}
            setIsCloseHuy={setIsModalHuy}
            validateInputs={validateInputs}
            resetForm={resetForm}
            userID={userID}
          />
        </div>
      </div>
    </ModalBig>
  )
}

export default AddQuyTien
