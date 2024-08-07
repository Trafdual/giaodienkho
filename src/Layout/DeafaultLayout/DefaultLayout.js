import './DefaultLayout.scss'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

function DefaultLayout () {
  return (
    <div className='wrapper'>
      <Header />
      <div className='sidebarDefault'>
        <Sidebar />
        <div className={'content'}>hello</div>
      </div>
    </div>
  )
}

export default DefaultLayout
