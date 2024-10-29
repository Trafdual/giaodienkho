/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from 'react'
import { ModalBig } from '~/components/ModalBig'

function EditSanPham ({ sku, idloaisp, isOpen, onClose }) {
  const [data, setdata] = useState([])
  const [inpuImel, setinpuImel] = useState({})
  const [inputPrice, setinputPrice] = useState({})
  const [price, setprice] = useState({})
  const [imel, setimel] = useState({})
  const inputRef = useRef(null)

  const toggleIMEIEdit = index => {
    setinpuImel(prev => ({ ...prev, [index]: !prev[index] }))
  }

  const togglePriceEdit = index => {
    setinputPrice(prev => ({ ...prev, [index]: !prev[index] }))
  }

  const fetchdata = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/getsanphambySKU/${sku}/${idloaisp}`
      )
      const data = await response.json()
      if (response.ok) {
        console.log(data)
        setdata(data)
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

  return (
    <ModalBig isOpen={isOpen} onClose={onClose}>
      <div>
        <h3>Cập nhật sản phẩm</h3>
        <table className='modal-table-test'>
          <thead>
            <tr>
              <td>Mã sản phẩm</td>
              <td>Tên sản phẩm</td>
              <td>Mã Imel</td>
              <td>Đơn giá</td>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
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
                          value={imel[item._id] ? imel[item._id] : item.imel}
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
                            price[item._id]
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
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={'4'}>Không có dữ liệu</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <button className='btnAddLoHang'>Cập nhật</button>
    </ModalBig>
  )
}

export default EditSanPham
