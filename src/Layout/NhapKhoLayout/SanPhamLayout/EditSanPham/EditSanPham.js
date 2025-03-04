/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from 'react'
import { ModalBig } from '~/components/ModalBig'
import { useToast } from '~/components/GlobalStyles/ToastContext'
import { ModalOnClose } from '~/components/ModalOnClose'
import './EditSanPham.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import '~/components/Loadingnut/loadingnut.scss'

function EditSanPham ({
  sku,
  idloaisp,
  isOpen,
  onClose,
  fetchsanpham,
  fetchlohang
}) {
  const [data, setdata] = useState([])
  const [inpuImel, setinpuImel] = useState({})
  const [inputPrice, setinputPrice] = useState({})
  const [price, setprice] = useState({})
  const [imel, setimel] = useState({})
  const inputRef = useRef(null)
  const { showToast } = useToast()
  const [isDulieu, setIsDulieu] = useState(true)
  const [isModalHuy, setIsModalHuy] = useState(false)
  const [isClickButton, setIsClickButton] = useState(false)

  const toggleIMEIEdit = index => {
    setinpuImel(prev => ({ ...prev, [index]: !prev[index] }))
  }

  const togglePriceEdit = index => {
    setinputPrice(prev => ({ ...prev, [index]: !prev[index] }))
  }

  const fetchdata = async () => {
    setIsDulieu(true)
    try {
      const response = await fetch(
        `http://localhost:3015/getsanphambySKU/${sku}/${idloaisp}`
      )
      const data = await response.json()
      if (response.ok) {
        console.log(data)
        setdata(data)
        setIsDulieu(false)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    if (isOpen && sku && idloaisp) {
      fetchdata()
    }
  }, [sku, idloaisp, isOpen])

  const handleClickOutside = event => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      setinpuImel({})
      setinputPrice({})
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handlePriceChange = (id, value) => {
    setprice(prev => ({ ...prev, [id]: value.replace(/\./g, '') }))
  }
  const hadleEditSanPham = async () => {
    // Chuẩn bị mảng sản phẩm cần cập nhật
    const productsToUpdate = data.map(item => ({
      _id: item._id,
      imel: imel[item._id] || item.imel,
      price: price[item._id] || item.price
    }))
    setIsClickButton(true)
    try {
      const response = await fetch('http://localhost:3015/putsomeproduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ products: productsToUpdate })
      })

      if (response.ok) {
        fetchsanpham()
        fetchlohang()
        showToast('Cập nhật sản phẩm thành công')
        handleCleardata()
        setIsClickButton(false)
      } else {
        console.error('Cập nhật sản phẩm thất bại')
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật sản phẩm:', error)
    }
  }
  const handleCleardata = () => {
    setinpuImel({})
    setinputPrice({})
    onClose()
    setdata([])
    setIsModalHuy(false)
  }
  const handleClose = () => {
    setIsModalHuy(true)
  }
  const handleDontSave = () => {
    setIsModalHuy(false)
    handleCleardata()
  }

  return (
    <ModalBig isOpen={isOpen} onClose={handleClose}>
      <div>
        <h3>Cập nhật sản phẩm</h3>
        <table className='modal-table-test'>
          <thead>
            <tr>
              <td className='tdEdit'>Mã sản phẩm</td>
              <td className='tdEdit'>Tên sản phẩm</td>
              <td className='tdEdit'>Mã Imel</td>
              <td className='tdEdit'>Đơn giá</td>
              <td className='tdEdit'>Chức năng</td>
            </tr>
          </thead>
          <tbody>
            {isDulieu ? (
              <tr>
                <td colSpan={'4'}>...Đang tải dữ liệu</td>
              </tr>
            ) : (
              data.map(item => (
                <tr key={item._id}>
                  <td>{item.masp}</td>
                  <td>{item.name}</td>
                  <td
                    onClick={() => toggleIMEIEdit(item._id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {inpuImel[item._id] ? (
                      <div className='imel-input-container' ref={inputRef}>
                        <input
                          type='text'
                          value={
                            imel[item._id] !== undefined
                              ? imel[item._id]
                              : item.imel
                          }
                          placeholder='Nhập IMEI'
                          onChange={e =>
                            setimel({ ...imel, [item._id]: e.target.value })
                          }
                          className='imel-input'
                          autoFocus
                          onBlur={() => toggleIMEIEdit(item._id)}
                        />
                      </div>
                    ) : (
                      imel[item._id] || item.imel
                    )}
                  </td>

                  <td
                    onClick={() => togglePriceEdit(item._id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {inputPrice[item._id] ? (
                      <div className='imel-input-container' ref={inputRef}>
                        <input
                          type='text'
                          value={
                            price[item._id] !== undefined
                              ? new Intl.NumberFormat().format(price[item._id])
                              : new Intl.NumberFormat().format(item.price)
                          }
                          placeholder='Nhập đơn giá'
                          onChange={e =>
                            handlePriceChange(item._id, e.target.value)
                          }
                          className='imel-input'
                          autoFocus
                          onBlur={() => togglePriceEdit(item._id)}
                        />
                      </div>
                    ) : (
                      new Intl.NumberFormat().format(
                        price[item._id] || item.price
                      ) +
                      ' ' +
                      'VNĐ'
                    )}
                  </td>
                  <td>
                    <button className='btnDeleteSp'>
                      <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <ModalOnClose
        isOpen={isModalHuy}
        Save={hadleEditSanPham}
        DontSave={handleDontSave}
        Cancel={() => setIsModalHuy(false)}
      />
      <button
        onClick={hadleEditSanPham}
        className={
          isClickButton ? 'btnAddNhaCungCap btnadddisabled' : 'btnAddNhaCungCap'
        }
        disabled={isClickButton}
      >
        {isClickButton ? '...Đang tải dữ liệu' : 'Cập nhật'}
      </button>
    </ModalBig>
  )
}

export default EditSanPham
