import './DefaultLayout.scss'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

function DefaultLayout ({children}) {
  return (
    <div className='wrapper'>
      <Header />
      <div className='sidebarDefault'>
        <Sidebar/>
        <div className={'content'}>{children}</div>
      </div>
    </div>
  )
}

export default DefaultLayout
