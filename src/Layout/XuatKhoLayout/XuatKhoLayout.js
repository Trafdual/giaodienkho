/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
// import './XuatKhoLayout.scss'
function XuatKhoLayout () {
  return (
    <div className='details'>
      <div className='recentOrders'>
        <div className='cardHeader'>
          <h2>Recent Orders</h2>
          <a href='#' className='btn'>
            View All
          </a>
        </div>
        <table>
          <thead>
            <tr>
              <td>Name</td>
              <td>Price</td>
              <td>Payment</td>
              <td>Status</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Star Refrigerator</td>
              <td>$1200</td>
              <td>Paid</td>
              <td>
                <span className='status delivered'>Delivered</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default XuatKhoLayout
