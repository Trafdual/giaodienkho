/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useEffect } from 'react'

import { ModalBig } from '../../../../../components/ModalBig'
import { useToast } from '../../../../../components/GlobalStyles/ToastContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faXmark } from '@fortawesome/free-solid-svg-icons'
import { Tooltip } from 'react-tippy'
import 'react-tippy/dist/tippy.css'
import AddTest2 from './AddTest2'

function AddTest ({ isOpen, onClose, loaispid, fetchData, fetchlohang }) {
  const [name, setName] = useState('')
  const [imel, setimel] = useState('')
  const [mangimel, setmangimel] = useState([])
  const [skudata, setskudata] = useState([])
  const [masku, setmasku] = useState('')
  const [userID, setuserID] = useState(localStorage.getItem('userId') || '')
  const [loadingSuppliers, setLoadingSuppliers] = useState(true)
  const [isTableVisible, setIsTableVisible] = useState(false)
  const [skuList, setSkuList] = useState([])
  const { showToast } = useToast()
  const [nameError, setNameError] = useState('')
  const [imelError, setimelError] = useState('')
  const [priceError, setpriceError] = useState('')
  const [price, setprice] = useState('')

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

  const valicolorInputs = () => {
    let valid = true

    if (!name) {
      setNameError('Vui lòng nhập tên nhà cung cấp.')
      valid = false
    } else {
      setNameError('')
    }

    if (mangimel.length === 0) {
      setimelError('Vui lòng nhập imel.')
      valid = false
    } else {
      setimelError('')
    }
    if (!price) {
      setpriceError('giá phải lớn hơn 0.')
      valid = false
    } else {
      setpriceError('')
    }

    return valid
  }

  const handleAddSanPham = async () => {
    if (valicolorInputs()) {
      try {
        const response = await fetch(
          `https://www.ansuataohanoi.com/postsp/${loaispid}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: name,
              imelList: mangimel,
              madungluongsku: masku,
              price: price
            })
          }
        )
        const data = await response.json()

        if (data.message) {
          showToast(`${data.message}`, 'error')
        } else {
          fetchlohang()
          fetchData()
          handleClose()
          showToast('Thêm sản phẩm thành công')
        }
      } catch (error) {
        console.error('Lỗi khi gửi yêu cầu thêm sản phẩm:', error)
        showToast('Thêm lô hàng thất bại', 'error')
        handleClose()
      }
    }
  }

  const resetForm = useCallback(() => {
    setName('')
    setimel('')
    setprice('')
    setpriceError('')
    setNameError('')
    setimelError('')
  }, [])

  const handleClose = () => {
    resetForm()
    onClose()
  }

  // useEffect(() => {
  //   const eventSource = new EventSource('https://www.ansuataohanoi.com/events')

  //   eventSource.onmessage = event => {
  //     const newMessage = JSON.parse(event.data)
  //     showToast(newMessage.message)
  //     fetchData()
  //   }

  //   return () => {
  //     eventSource.close()
  //   }
  // }, [])

  const fetchSku = async () => {
    try {
      const response = await fetch(
        `https://www.ansuataohanoi.com/getdungluongsku/${userID}`
      )
      const data = await response.json()

      if (response.ok) {
        setskudata(data)
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

  const handleKeyPress = event => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleAddMasp()
    }
  }
  const handleRemoveimel = index => {
    const newmangmaimel = [...mangimel]
    newmangmaimel.splice(index, 1)
    setmangimel(newmangmaimel)
  }

  // Thêm mã sản phẩm vào danh sách
  const handleAddMasp = () => {
    if (!imel) {
      setimelError('Vui lòng nhập mã sản phẩm.')
      return
    }

    setmangimel(prevMangimel => [...prevMangimel, imel])
    setimel('')
    setimelError('')
  }
  console.log(skudata)
  return (
    <ModalBig isOpen={isOpen} onClose={handleClose}>
      <div className='divAddSanPham'>
        <h2>Thêm sản phẩm</h2>
        <div className='divinputncc'>
          <h4>Mã sku</h4>
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
                          className='trdulieu'
                          key={supplier._id}
                          onClick={() => {
                            setmasku(supplier.madungluong)
                            setIsTableVisible(false)
                            setName(supplier.name)
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
              className='divChonncc'
              onClick={() => setIsTableVisible(!isTableVisible)}
            >
              {masku ? `${masku}` : 'Chọn mã sku'}
              <FontAwesomeIcon icon={faChevronDown} className='iconNcc' />
            </button>
          </Tooltip>
        </div>
        <div className='divtenkho'>
          <input
            type='text'
            className={`tenkho ${nameError ? 'input-error' : ''}`}
            placeholder=''
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <label htmlFor='' className='label'>
            Nhập tên sản phẩm
          </label>
        </div>
        {nameError && <div className='error'>{nameError}</div>}
        <div className='divdiachikho'>
          <input
            type='text'
            className={`diachi ${imelError ? 'input-error' : ''}`}
            placeholder=''
            value={imel}
            onChange={e => setimel(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <label htmlFor='' className='label'>
            Nhập imel
          </label>
        </div>
        {imelError && <div className='error'>{imelError}</div>}
        {mangimel.length > 0 && (
          <div className='mangmasp-list'>
            <h4>Danh sách mã imel:</h4>
            <ul className='ulmangmasp'>
              {mangimel.map((item, index) => (
                <li key={index} className='mangmasp-item'>
                  {item}
                  <button
                    className='remove-btn'
                    onClick={() => handleRemoveimel(index)}
                  >
                    <FontAwesomeIcon className='remove-icon' icon={faXmark} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className='divdiachikho'>
          <input
            type='text'
            className={`diachi ${priceError ? 'input-error' : ''}`}
            placeholder=''
            value={new Intl.NumberFormat().format(price.replace(/\./g, ''))}
            onChange={e => {
              const rawValue = e.target.value.replace(/\./g, '')
              setprice(rawValue)
              if (e.target.value) {
                setpriceError('')
              }
            }}
          />
          <label htmlFor='' className='label'>
            Nhập giá
          </label>
        </div>
        {priceError && <div className='error'>{priceError}</div>}
        <AddTest2 />

        <button onClick={handleAddSanPham} className='btnAddLoHang'>
          Thêm sản phẩm
        </button>
        <button onClick={handleClose} className='btnhuyAddLoHang'>
          Hủy
        </button>
      </div>
      
    </ModalBig>
  )
}

export default AddTest
