/* eslint-disable react-hooks/exhaustive-deps */
import { HeaderAdmin } from './HeaderAdmin'
import { SidebarAdmin } from './SidebarAdmin'
import { useSearchParams } from 'react-router-dom'
import { UserLayout } from '../UserLayout'
import { UserBiKhoaLayout } from '../UserBiKhoaLayout'
import './AdminLayout.scss'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getFromLocalStorage } from '../../../components/MaHoaLocalStorage/MaHoaLocalStorage'
import { AnimatePresence, motion } from 'framer-motion'
import { TheLoaiBlogLayout } from '../TheLoaiBlogLayout'

function AdminLayout () {
  const [searchParams] = useSearchParams()
  const tabFromUrl = searchParams.get('tab') || 'Users'
  const data = getFromLocalStorage('data')

  const navigate = useNavigate()
  console.log('data', data)

  useEffect(() => {
    if (!data) {
      navigate('/')
    }
    if (data) {
      if (data.data.user[0].role !== 'admin') {
        navigate('/')
      }
    }
  }, [data])

  return (
    <div className='admin_container'>
      <SidebarAdmin activeTab={tabFromUrl} />
      <div className='admin_body'>
        <HeaderAdmin />
        <AnimatePresence mode='wait'>
          <motion.div
            key={tabFromUrl}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.95 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            {tabFromUrl === 'Users' && <UserLayout />}
            {tabFromUrl === 'Thể loại Blog' && <TheLoaiBlogLayout />}
            {tabFromUrl === 'Users bị khóa' && <UserBiKhoaLayout />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default AdminLayout
