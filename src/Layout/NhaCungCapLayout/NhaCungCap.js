/* eslint-disable react-hooks/exhaustive-deps */
import './NhaCungCap.scss'
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import '../ColumnResizer/columnResizer.scss'
import { enableColumnResizing } from '../ColumnResizer/columnResizer'
import { Loading } from '~/components/Loading'

import { AddNhaCungCap } from './AddNhaCungCap'
import { EditNhaCungCap } from './EditNhaCungCap'
function NhaCungCapLayout () {
  const [nhacungcap, setnhacungcap] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenEdit, setIsOpenEdit] = useState(false)
  const [idncc, setidncc] = useState('')
  const [loading, setLoading] = useState(true)

  const [khoID, setKhoID] = useState(localStorage.getItem('khoID') || '')
  const handleCloseModal = () => {
    setIsOpen(false)
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newKhoID = localStorage.getItem('khoID') || ''
      if (newKhoID !== khoID) {
        console.log('Interval detected change, updating khoID:', newKhoID)
        setKhoID(newKhoID)
      }
    }, 1000) // Kiểm tra mỗi giây

    return () => clearInterval(intervalId)
  }, [localStorage.getItem('khoID')])

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://www.ansuataohanoi.com/getnhacungcap/${khoID}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        setnhacungcap(data)
        setLoading(false)
      } else {
        console.error('Failed to fetch data')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    console.log(localStorage.getItem('khoID'))
    if (khoID) {
      fetchData()
    }
  }, [khoID])

  useEffect(() => {
    enableColumnResizing('.tablenhap')
  }, [])
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          {
            <div className='detailsnhap'>
              <div className='recentOrdersnhap'>
                <div className='headernhap'>
                  <h2 className='divncc'>Nhà cung cấp</h2>
                  <button className='btnthemlo' onClick={() => setIsOpen(true)}>
                    <FontAwesomeIcon className='iconncc' icon={faPlus} />
                    <h3>Thêm nhà cung cấp</h3>
                  </button>
                </div>
                <div className='table-container'>
                  <table className='tablenhap'>
                    <thead className='theadnhap'>
                      <tr>
                        <td className='tdnhap'>Mã nhà cung cấp</td>
                        <td className='tdnhap'>Tên nhà cung cấp</td>
                        <td className='tdnhap'>Số điện thoại</td>
                        <td className='tdnhap'>Địa chỉ</td>
                        <td className='tdnhap'>Chức năng</td>
                      </tr>
                    </thead>
                    <tbody className='tbodynhap'>
                      {nhacungcap.length > 0 ? (
                        nhacungcap.map(ncc => (
                          <tr key={ncc._id}>
                            <td>{ncc.mancc}</td>
                            <td>{ncc.name}</td>
                            <td>{ncc.phone}</td>
                            <td>{ncc.address}</td>

                            <td className='tdchucnang'>
                              <button
                                className='btncnncc'
                                onClick={() => {
                                  setIsOpenEdit(true)
                                  setidncc(ncc._id)
                                }}
                              >
                                <h3>Cập nhật</h3>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan='5'>Không có nhà cung cấp nào</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <AddNhaCungCap
                isOpen={isOpen}
                onClose={handleCloseModal}
                khoID={khoID}
                setnhacungcap={setnhacungcap}
              />
              <EditNhaCungCap
                isOpen={isOpenEdit}
                onClose={() => setIsOpenEdit(false)}
                idncc={idncc}
                fetchdata={fetchData}
                setidncc={setidncc}
              />
            </div>
          }
        </>
      )}
    </>
  )
}

export default NhaCungCapLayout
