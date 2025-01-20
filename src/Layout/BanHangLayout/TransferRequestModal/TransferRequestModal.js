import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './TransferRequestModal.scss'
import { useToast } from '../../../components/GlobalStyles/ToastContext'
function TransferRequestModal ({ isOpen, onClose, store, productName, masku }) {
  const [quantity, setQuantity] = useState(1) // Quản lý số lượng yêu cầu
  const [reason, setReason] = useState('') // Lý do điều chuyển (mặc định "")
  const [reference, setReference] = useState('') // Tham chiếu
  const [currentDate, setCurrentDate] = useState('')
  const { showToast } = useToast()
  const idkho1 = localStorage.getItem('khoIDBH')
  useEffect(() => {
    // Lấy ngày hiện tại ở định dạng YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0]
    setCurrentDate(today)
  }, [])
  if (!isOpen) return null
  // console.log(store.khoId)

  const handleSendRequest = async () => {
    try {
      const payload = {
        masku,
        soluong: quantity,
        tenkhochuyen: store.tenkho,
        lido: reason.trim()
      }

      const response = await axios.post(
        `http://localhost:3015/postyeucaudc/${idkho1}`,
        payload
      )

      if (response.status === 200) {
        showToast('Gửi yêu cầu điều chuyển thành công!', 'success') // Hiển thị toast thành công
        onClose() // Đóng modal sau khi gửi thành công
      } else {
        showToast('Đã xảy ra lỗi, vui lòng thử lại.', 'error')
      }
    } catch (error) {
      console.error(error)
      showToast('Không thể gửi yêu cầu. Vui lòng kiểm tra lại.', 'error')
    }
  }

  return (
    <div className='transfer-request-modal'>
      <div className='modal-container'>
        <h2 className='modal-header'>Yêu cầu điều chuyển</h2>
        <div className='modal-body-transfer'>
          <div className='general-info'>
            <div className='info-group'>
              <label>Chi nhánh xin hàng *</label>
              <select>
                <option>
                  {store.tenkho} ({store.khoId})
                </option>
              </select>
            </div>
            <div className='info-group'>
              <label>Lý do</label>
              <input
                type='text'
                placeholder='Nhập nội dung (không bắt buộc)...'
                value={reason}
                onChange={e => setReason(e.target.value)}
              />
            </div>
            <div className='info-group'>
              <label>Tham chiếu</label>
              <input
                type='text'
                placeholder='Nhập tham chiếu...'
                value={reference}
                onChange={e => setReference(e.target.value)}
              />
            </div>
            <div className='info-group right'>
              <label>Số phiếu</label>
              <span>BM-YCDC000001</span>
            </div>
            <div className='info-group right'>
              <label>Ngày chứng từ</label>
              <input value={currentDate} disabled></input>
            </div>
            <div className='info-group right'>
              <label>Trạng thái</label>
              <span className='status'>Chờ xác nhận</span>
            </div>
          </div>
          <div className='details1'>
            <h3>CHI TIẾT</h3>
            <table>
              <thead>
                <tr>
                  <th>Mã SKU</th>
                  <th>Tên hàng hóa</th>
                  <th>ĐVT</th>
                  <th>SL yêu cầu</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{masku}</td>
                  <td>{productName}</td>
                  <td>
                    <select>
                      <option>Chiếc</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type='number'
                      value={quantity}
                      onChange={e => setQuantity(Number(e.target.value))}
                      min='1'
                    />
                  </td>
                  <td>
                    <button className='delete-btn'>×</button>
                  </td>
                </tr>
                <tr>
                  <td colSpan='5'>
                    <input type='text' placeholder='SKU, tên, mã vạch' />
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan='3'>Tổng:</td>
                  <td>{quantity}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        <div className='modal-footer'>
          <button className='primary-btn' onClick={handleSendRequest}>
            Gửi yêu cầu
          </button>
          <button className='secondary-btn' onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}

export default TransferRequestModal
