import { HeaderAdmin } from './HeaderAdmin'
import { SidebarAdmin } from './SidebarAdmin'


function AdminLayout () {
  return (
    <div className='admin_container'>
      <SidebarAdmin />
      <div className='admin_body'>
        <HeaderAdmin />

      </div>
    </div>
  )
}

export default AdminLayout
