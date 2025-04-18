import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './TransferRequestModal.scss'
import { useToast } from '../../../components/GlobalStyles/ToastContext'
import { getApiUrl } from '../../../api/api'
import { motion, AnimatePresence } from 'framer-motion'

function TransferRequestModal ({
  isOpen,
  onClose,
  store,
  productName,
  idsku,
  masku
}) {
  const [quantity, setQuantity] = useState(1)
  const [reason, setReason] = useState('')
  const [reference, setReference] = useState('')
  const [currentDate, setCurrentDate] = useState('')
  const { showToast } = useToast()
  const idkho1 = localStorage.getItem('khoIDBH')
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    setCurrentDate(today)
  }, [])

  const handleSendRequest = async () => {
    try {
      const payload = {
        idsku,
        soluong: quantity,
        idkhochuyen: store.khoId,
        lido: reason.trim()
      }

      const response = await axios.post(
        `${getApiUrl('domain')}/postyeucaudc/${idkho1}`,
        payload
      )

      if (response.status === 200) {
        showToast('Gửi yêu cầu điều chuyển thành công!', 'success')
        onClose()
      } else {
        showToast('Đã xảy ra lỗi, vui lòng thử lại.', 'error')
      }
    } catch (error) {
      console.error(error)
      showToast('Không thể gửi yêu cầu. Vui lòng kiểm tra lại.', 'error')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className='transfer-request-modal'>
          <motion.div
            className='modal-container'
            initial={{ opacity: 0, scale: 0.8, y: '-50%' }}
            animate={{ opacity: 1, scale: 1, y: '0%' }}
            exit={{ opacity: 0, scale: 0.8, y: '-50%' }}
            transition={{ duration: 0.3 }}
            onClick={e => e.stopPropagation()}
          >
            <h2 className='modal-header'>Yêu cầu điều chuyển</h2>
            <div className='modal-body-transfer'>
              <div className='general-info'>
                <div className='info-group'>
                  <label>Chi nhánh xin hàng *</label>
                  <select>
                    <option>{store.tenkho}</option>
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
              <div className='details12'>
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
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default TransferRequestModal
