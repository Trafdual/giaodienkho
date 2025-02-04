/* eslint-disable react-hooks/exhaustive-deps */
import { ModalBig } from '~/components/ModalBig'
import { useState, useEffect, useRef } from 'react'
import { Tooltip } from 'react-tippy'
import 'react-tippy/dist/tippy.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faPlus } from '@fortawesome/free-solid-svg-icons'
import './ModalThuNo.scss'
import { AddLoaiChungTu } from '~/Layout/QuyTienLayout/AddQuyTien/AddLoaiChungTu'
import { useToast } from '~/components/GlobalStyles/ToastContext'

function ModalThuNo ({
  isOpen,
  onClose,
  userId,
  hoadons,
  khoID,
  fetchhoadon,
  khachhangid
}) {
  const { showToast } = useToast()
  const [loaichungtus, setloaichungtus] = useState([])
  const [isTableloaichungtu, setIsTableloaichungtu] = useState(false)
  const [isTablemethod, setIsTablemethod] = useState(false)
  const [isOpenModalAddLct, setIsOpenModalAddLct] = useState(false)

  const [loaichungtu, setloaichungtu] = useState('')
  const [loaichungtuId, setloaichungtuId] = useState('')
  const [loaichungtuError, setloaichungtuError] = useState('')
  const [methods, setmethods] = useState(['Tiền mặt', 'Tiền gửi'])
  const [method, setmethod] = useState('Tiền mặt')
  const [methodError, setmethodError] = useState('')

  const tooltipRefloaichungtu = useRef(null)
  const tooltipRefmethod = useRef(null)

  const [selectedIds, setSelectedIds] = useState([]) // Lưu danh sách ID đã chọn

  // Hàm xử lý chọn/bỏ chọn một hóa đơn
  const handleCheckboxChange = id => {
    setSelectedIds(
      prevSelected =>
        prevSelected.includes(id)
          ? prevSelected.filter(item => item !== id) // Nếu đã có ID, bỏ ID ra
          : [...prevSelected, id] // Nếu chưa có, thêm ID vào
    )
  }

  // Hàm chọn/bỏ chọn tất cả hóa đơn
  const handleSelectAll = e => {
    if (e.target.checked) {
      setSelectedIds(hoadons.map(item => item._id)) // Chọn tất cả
    } else {
      setSelectedIds([]) // Bỏ chọn tất cả
    }
  }

  const fetchloaichungtu = async () => {
    try {
      const response = await fetch(
        `https://ansuataohanoi.com/getloaichungtu/${userId}`
      )
      const data = await response.json()
      if (response.ok) {
        setloaichungtus(data)
      }
    } catch (error) {
      console.error('Error fetching:', error)
    }
  }
  useEffect(() => {
    if (userId) {
      fetchloaichungtu()
    }
  }, [userId])
  const handleclose = () => {
    onClose()
    setSelectedIds([])
    setloaichungtu('')
    setmethod('Tiền mặt')
    setloaichungtuError('')
    setmethodError('')
  }

  const handleThuNo = async () => {
    try {
      const response = await fetch(
        `https://ansuataohanoi.com/thuno/${userId}/${khoID}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ids: selectedIds,
            loaichungtu: loaichungtuId,
            method: method,
            khachhangid: khachhangid
          })
        }
      )

      if (response.ok) {
        showToast('Thu nợ thành công')
        handleclose()
        fetchhoadon()
      }
    } catch (error) {
      console.error('Error fetching:', error)
    }
  }

  return (
    <ModalBig isOpen={isOpen} onClose={onClose}>
      <div>
        <div className='divinputncc'>
          <h4>Phương thức</h4>
          <Tooltip
            trigger='click'
            interactive
            arrow
            position='bottom'
            open={isTablemethod}
            onRequestClose={() => setIsTablemethod(false)}
            html={
              <div className='supplier-table-container' ref={tooltipRefmethod}>
                <table className='supplier-info-table'>
                  <thead>
                    <tr>
                      <th>Phương thức</th>
                    </tr>
                  </thead>
                  <tbody>
                    {methods.length > 0 ? (
                      methods.map((lct, index) => (
                        <tr
                          className='trdulieu'
                          key={index}
                          onClick={() => {
                            setmethod(lct)
                            setIsTablemethod(false)
                            setmethodError('')
                          }}
                        >
                          <td>{lct}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={1}
                          style={{ textAlign: 'center', padding: '10px' }}
                        >
                          Không có phương thức nào
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
              onClick={() => setIsTablemethod(!isTablemethod)}
            >
              {method ? `${method}` : 'Chọn phương thức'}
              <FontAwesomeIcon icon={faChevronDown} className='iconNcc' />
            </button>
          </Tooltip>
        </div>
        {methodError && <div className='error'>{methodError}</div>}
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
                              setloaichungtuId(lct._id)
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
            fetchdata={fetchloaichungtu}
            userID={userId}
          />
        </div>
        {loaichungtuError && <div className='error'>{loaichungtuError}</div>}
        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
          <h4>Danh sách hóa đơn</h4>
        </div>
        <div className='divTableSP'>
          <table className='modal-table-test'>
            <thead>
              <tr>
                <th>
                  <input
                    type='checkbox'
                    onChange={handleSelectAll}
                    checked={
                      selectedIds.length === hoadons.length &&
                      hoadons.length > 0
                    }
                  />
                </th>
                <th>STT</th>
                <th>ID</th>
                <th>Mã HĐ</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {hoadons.map((item, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type='checkbox'
                      checked={selectedIds.includes(item._id)}
                      onChange={() => handleCheckboxChange(item._id)}
                    />
                  </td>
                  <td>{index + 1}</td>
                  <td>{item._id}</td>
                  <td>{item.mahoadon}</td>
                  <td>{item.tongtien.toLocaleString()} VND</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='divModalThuNoOnClose'>
          <button className='btnsaveClose' onClick={handleThuNo}>
            Thu nợ
          </button>
          <button className='btncancelClose'>Hủy bỏ</button>
        </div>
      </div>
    </ModalBig>
  )
}

export default ModalThuNo
