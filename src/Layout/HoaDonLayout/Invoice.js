// Invoice.js
import React from 'react'

const Invoice = ({ hd }) => {
  console.error(hd)
  return (
    <div>
      <style>
        {`
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          h2 {
            text-align: center;
          }
          .invoice-header, .invoice-footer {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
          }
          .invoice-footer {
            margin-top: 30px;
            border-top: 1px solid #000;
            padding-top: 10px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          table, th, td {
            border: 1px solid black;
          }
          th, td {
            padding: 8px;
            text-align: left;
          }
          .text-right {
            text-align: right;
          }
          .text-center {
            text-align: center;
          }
        `}
      </style>
      <h2>HÓA ĐƠN BÁN HÀNG</h2>
      <div className='invoice-header'>
        <div>
          <p>
            <strong>Cửa hàng ABC</strong>
          </p>
          <p>Địa chỉ: 123 Đường XYZ, Hà Nội</p>
          <p>SĐT: 0123456789</p>
        </div>
        <div>
          <p>
            <strong>Mã hóa đơn:</strong> {hd.mahd}
          </p>
          <p>
            <strong>Ngày xuất:</strong> {hd.date}
          </p>
          <p>
            <strong>Mã khách hàng:</strong> {hd.makh}
          </p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th className='text-center'>Mã sản phẩm</th>
            <th className='text-center'>Sản phẩm</th>
            <th className='text-center'>Dung lượng</th>
            <th className='text-center'>Màu sắc</th>
            <th className='text-center'>Đơn giá</th>
            <th className='text-center'>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {hd.sanpham.map(sp => (
            <tr key={sp.masp}>
              <td className='text-center'>{sp.masp}</td>
              <td className='text-center'>{sp.tenmay}</td>
              <td className='text-center'>{sp.dungluong}</td>
              <td className='text-center'>{sp.mausac}</td>
              <td className='text-center'>{sp.price.toLocaleString()} VND</td>
              <td className='text-center'>{sp.price.toLocaleString()} VND</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className='invoice-footer'>
        <div>
          <p>
            <strong>Cảm ơn quý khách đã mua hàng!</strong>
          </p>
        </div>
        <div>
          <p>
            <strong>Tổng tiền:</strong> {hd.tongtien.toLocaleString()} VND
          </p>
        </div>
      </div>
    </div>
  )
}

export default Invoice
