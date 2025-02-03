/* eslint-disable react-hooks/exhaustive-deps */
import { ModalBig } from '~/components/ModalBig'
import { useState, useEffect, useRef } from 'react'
import { Tooltip } from 'react-tippy'
import 'react-tippy/dist/tippy.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faPlus } from '@fortawesome/free-solid-svg-icons'

function ModalThuNo ({ isOpen, onClose, userId }) {
  const [loaichungtus, setloaichungtus] = useState([])
  const [isTableloaichungtu, setIsTableloaichungtu] = useState(false)
  const [isTablemethod, setIsTablemethod] = useState(false)

  const [loaichungtu, setloaichungtu] = useState('')
  const [loaichungtuError, setloaichungtuError] = useState('')
  const [methods, setmethods] = useState(['Tiền mặt', 'Tiền gửi'])
  const [method, setmethod] = useState('Tiền mặt')
  const [methodError, setmethodError] = useState('')

  const tooltipRefloaichungtu = useRef(null)
  const tooltipRefmethod = useRef(null)


  const fetchloaichungtu = async () => {
    try {
      const response = await fetch(
        `https://ansuataohanoi.com/getloaichungtu/${userId}`
      )
      const data = await response.json()
      if (response.ok) {
        setloaichungtus(data)
      }
    } catch (error) {
      console.error('Error fetching:', error)
    }
  }
  useEffect(() => {
    if (userId) {
      fetchloaichungtu()
    }
  }, [userId])
  return (
    <ModalBig isOpen={isOpen} onClose={onClose}>
      <div>
        <div className='divinputncc'>
          <h4>Phương thức</h4>
          <Tooltip
            trigger='click'
            interactive
            arrow
            position='bottom'
            open={isTablemethod}
            onRequestClose={() => setIsTablemethod(false)}
            html={
              <div
                className='supplier-table-container'
                ref={tooltipRefmethod}
              >
                <table className='supplier-info-table'>
                  <thead>
                    <tr>
                      <th>Phương thức</th>
                    </tr>
                  </thead>
                  <tbody>
                    {methods.length > 0 ? (
                      methods.map((lct, index) => (
                        <tr
                          className='trdulieu'
                          key={index}
                          onClick={() => {
                            setmethod(lct)
                            setIsTablemethod(false)
                            setmethodError('')
                          }}
                        >
                          <td>{lct}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={1}
                          style={{ textAlign: 'center', padding: '10px' }}
                        >
                          Không có phương thức nào
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            }
          >
            <button
              className='divChonncc'
              onClick={() => setIsTablemethod(!isTablemethod)}
            >
              {method ? `${method}` : 'Chọn phương thức'}
              <FontAwesomeIcon icon={faChevronDown} className='iconNcc' />
            </button>
          </Tooltip>
          <button className='btnadd'>
            <FontAwesomeIcon icon={faPlus} className='icon' />
          </button>
          {/* <AddLoaiChungTu
            isOpen={isOpenModalAddLct}
            onClose={() => setIsOpenModalAddLct(false)}
            fetchdata={fetchLoaichungtu}
            userID={userID}
          /> */}
        </div>
        {methodError && <div className='error'>{methodError}</div>}
        <div className='divinputncc'>
          <h4>Loại chứng từ</h4>
          <Tooltip
            trigger='click'
            interactive
            arrow
            position='bottom'
            open={isTableloaichungtu}
            onRequestClose={() => setIsTableloaichungtu(false)}
            html={
              <div
                className='supplier-table-container'
                ref={tooltipRefloaichungtu}
              >
                <table className='supplier-info-table'>
                  <thead>
                    <tr>
                      <th>Loại chứng từ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loaichungtus.length > 0 ? (
                      loaichungtus
                        .filter(lct => lct.method === method)
                        .map((lct, index) => (
                          <tr
                            className='trdulieu'
                            key={index}
                            onClick={() => {
                              setloaichungtu(lct.maloaict)
                              setIsTableloaichungtu(false)
                              setloaichungtuError('')
                            }}
                          >
                            <td>
                              {lct.name} - {lct.method}
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td
                          colSpan={1}
                          style={{ textAlign: 'center', padding: '10px' }}
                        >
                          Không có loại chứng từ
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            }
          >
            <button
              className='divChonncc'
              onClick={() => setIsTableloaichungtu(!isTableloaichungtu)}
            >
              {loaichungtu ? `${loaichungtu}` : 'Chọn loại chứng từ'}
              <FontAwesomeIcon icon={faChevronDown} className='iconNcc' />
            </button>
          </Tooltip>
          <button className='btnadd'>
            <FontAwesomeIcon icon={faPlus} className='icon' />
          </button>
          {/* <AddLoaiChungTu
            isOpen={isOpenModalAddLct}
            onClose={() => setIsOpenModalAddLct(false)}
            fetchdata={fetchLoaichungtu}
            userID={userID}
          /> */}
        </div>
        {loaichungtuError && <div className='error'>{loaichungtuError}</div>}
      </div>
    </ModalBig>
  )
}

export default ModalThuNo
