import { HeaderAdmin } from './HeaderAdmin'
import { SidebarAdmin } from './SidebarAdmin'
import { useSearchParams } from 'react-router-dom'
import { UserLayout } from '../UserLayout'
import { BlogLayout } from '../BlogLayout'
import './AdminLayout.scss'

function AdminLayout () {
  const [searchParams] = useSearchParams()
  const tabFromUrl = searchParams.get('tab') || 'Users'

  return (
    <div className='admin_container'>
      <SidebarAdmin activeTab={tabFromUrl} />
      <div className='admin_body'>
        <HeaderAdmin />
        {tabFromUrl === 'Users' && <UserLayout />}
        {tabFromUrl === 'Blog' && <BlogLayout />}
      </div>
    </div>
  )
}

export default AdminLayout
