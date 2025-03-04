/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import './ModalChiTietHoaDon.scss'
import { useState, useEffect } from 'react'

function ModalChiTietHoaDon ({ isOpen, onClose, idhoadon }) {
  const [data, setdata] = useState(null)

  const fetchchitiet = async () => {
    try {
      const response = await fetch(
        `http://localhost:3015/gethoadonchitiet/${idhoadon}`
      )
      if (response.ok) {
        const data = await response.json()
        setdata(data)
      }
    } catch (error) {
      console.error('Error fetching:', error)
    }
  }
  console.log(data)

  useEffect(() => {
    if (idhoadon) {
      fetchchitiet()
    }
  }, [idhoadon])

  if (!isOpen) return null

  return (
    <div className='modal-cthd-overlay'>
      <div className='modal-cthd-container'>
        <div className='modal-cthd-header'>
          <h2 className='modal-cthd-title'>
            Hóa đơn thanh toán
            <span className='modal-cthd-id'>Số: {data?.mahd}</span>
          </h2>
          <button className='modal-cthd-close-btn' onClick={onClose}>
            &times;
          </button>
        </div>
        <div className='modal-cthd-body'>
          <div className='modal-cthd-info'>
            <p>
              <strong>Ngày:</strong> {data?.date}
            </p>
            <p>
              <strong>Nhân viên:</strong> {`Nguyễn Ngọc Ánh`}
            </p>
            <p>
              <strong>Thu ngân:</strong> {`Hà thu ngân chuối`}
            </p>
            <p>
              <strong>Khách hàng:</strong>{' '}
              {`${data?.namekhachhang} (${data?.phone})`}
            </p>
          </div>
          <table className='modal-cthd-table'>
            <thead>
              <tr>
                <th>Tên hàng hóa</th>
                <th>Số lượng</th>
                <th>Đơn giá</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {data?.sanpham.map((item, index) => (
                <tr key={index}>
                  <td>
                    {item.namesanpham} <br />
                    {item.loaihanghoa === 'Điện thoại' && (
                      <span className='modal-cthd-serial'>
                        Serial/IMEI:
                        {item.details.map((detail, dindex) => (
                          <span key={dindex}>
                            {detail.imel}
                            {dindex < item.details.length - 1 && ', '}
                          </span>
                        ))}
                      </span>
                    )}
                  </td>
                  <td>{item.details.length}</td>
                  <td>
                    {(item.tongdongia / item.details.length).toLocaleString()}
                  </td>
                  <td>{item.tongdongia.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className='modal-cthd-summary'>
            <p>
              <strong>Thành tiền:</strong> {data?.tongtien.toLocaleString()}
            </p>
            <p>
              <strong>Tổng thanh toán:</strong>
              {data?.tongtien.toLocaleString()}
            </p>
            <p>
              <strong>{data?.method}:</strong> {data?.tongtien.toLocaleString()}
            </p>
            <p>
              <strong>Công nợ:</strong>
              {data?.congno ? data?.tongtien.toLocaleString() : 0}
            </p>
          </div>
        </div>
        <div className='modal-cthd-footer'>
          <button className='modal-cthd-print-btn'>In hóa đơn</button>
          <button className='modal-cthd-edit-btn'>Sửa</button>
          <button className='modal-cthd-close-btn' onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalChiTietHoaDon
