import HeaderBanHang from './HeaderBanHang/HeaderBanHang'
import { getFromLocalStorage } from '~/components/MaHoaLocalStorage/MaHoaLocalStorage'

function DefaultBanHangLayout ({ children }) {
  const userId = getFromLocalStorage('userId') || ''
  const username = getFromLocalStorage('name') || ''

  return (
    <div>
      <HeaderBanHang userId={userId} username={username} />
      {children}
    </div>
  )
}

export default DefaultBanHangLayout
