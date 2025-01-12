import './BaoCaoBanHangLayout.scss'

function BaoCaoBanHangLayout () {
  return (
    <div className='bao-cao-ban-hang-layout'>
      <div className='header'>
        <button className='btn'>Chọn báo cáo</button>
        <div className='filters'>
          <select>
            <option>Tháng này</option>
            {/* Thêm các tùy chọn khác */}
          </select>
          <input type='date' defaultValue='2025-01-01' />
          <input type='date' defaultValue='2025-01-31' />
          <button className='btn'>Lấy dữ liệu</button>
        </div>
        <div className='actions'>
          <button className='btn'>In</button>
          <button className='btn'>Xuất khẩu</button>
          <button className='btn'>⚙️</button>
        </div>
      </div>

      <div className='table-container'>
        <table>
          <thead>
            <tr>
              <th>Ngày</th>
              <th>
                Tổng
                <br />
                (1)=(3)+(4)-(5)-(14)
              </th>
              <th>
                Tiền hàng
                <br />
                (3)
              </th>
              <th>
                Tiền phí
                <br />
                (4)
              </th>
              <th>
                Khuyến mại
                <br />
                (5)
              </th>
              <th>
                Tỷ lệ KM (%)
                <br />
                (6)
              </th>
              <th>
                Tiền mặt
                <br />
                (7)
              </th>
              <th>Chuyển khoản</th>
              <th>
                Công nợ
                <br />
                (11)
              </th>
              <th>
                Thu hộ <br />
                (12)
              </th>
              <th>
                Thực thu <br />
                (13) = (1) -(11) -(12)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>01/01/2025</td>
              <td>134.849.000</td>
              <td>134.849.000</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>31.449.000</td>
              <td>0</td>
              <td>0</td>
              <td>31.449.000</td>
              <td>0</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default BaoCaoBanHangLayout
