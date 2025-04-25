/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import '../../../ColumnResizer/columnResizer'
import { enableColumnResizing } from '../../../ColumnResizer/columnResizer'

import { PaginationComponent } from '~/components/NextPage'
import { getFromLocalStorage } from '~/components/MaHoaLocalStorage/MaHoaLocalStorage'
import { useNavigate } from 'react-router-dom'
import { getApiUrl } from '~/api/api'
import { CustomModal } from '~/components/CustomModal'
import './DonNo.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { ModalTraNo } from './ModalTraNo'

function DonNo ({ isOpen, onClose, idtrano, fetchtrano }) {
  const [data, setdata] = useState([])

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(9)
  const [isOpenTraNo, setisOpenTraNo] = useState(false)
  const [iddonno, setiddonno] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const token = getFromLocalStorage('token')
    if (!token) {
      navigate('/')
    }
  }, [navigate])

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${getApiUrl('domain')}/getdonno/${idtrano}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        setdata(data)
      } else {
        console.error('Failed to fetch data')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    if (isOpen && idtrano) {
      fetchData()
    }
  }, [isOpen, idtrano])

  useEffect(() => {
    enableColumnResizing('.tablenhap')
  }, [])

  const totalPages = Math.ceil(data.length / itemsPerPage)
  const totalResults = data.length

  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber)
  }

  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <div className='divnhacungcap'>
        <div className='divdonno'>
          <div className='divdonnotong'>
            <div className='table-container'>
              <table className='tablenhap'>
                <thead className='theadnhap'>
                  <tr>
                    <td className='thsmall'>STT</td>
                    <td>Mã lô hàng</td>
                    <td className='tdnhap'>Tiền nợ</td>
                    <td className='tdnhap'>Tiền phải trả</td>
                    <td className='tdnhap'>Tiền đã trả</td>
                    <td className='tdnhap'>Ngày trả</td>
                    <td className='tdnhap'>Trả nợ</td>
                  </tr>
                </thead>
                <tbody className='tbodynhap'>
                  {data.length > 0 ? (
                    data.map((ncc, index) => (
                      <tr key={ncc._id}>
                        <td>{index + 1}</td>
                        <td>{ncc.malohang}</td>
                        <td>{ncc.tienno.toLocaleString()}</td>
                        <td>{ncc.tienphaitra.toLocaleString()}</td>
                        <td>{ncc.tiendatra.toLocaleString()}</td>
                        <td>{ncc.ngaytra || 'Chưa cập nhật'}</td>
                        <td>
                          {ncc.dathanhtoan ? (
                            <span className='btnstatus success'>
                              <FontAwesomeIcon
                                icon={faCheck}
                                className='iconcheck'
                              />
                            </span>
                          ) : (
                            <button
                              className='btntrano'
                              onClick={() => {
                                setisOpenTraNo(true)
                                setiddonno(ncc._id)
                              }}
                            >
                              Trả nợ
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan='8'>Không có đơn nợ nào</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <ModalTraNo
            isOpen={isOpenTraNo}
            onClose={() => setisOpenTraNo(false)}
            iddonno={iddonno}
            fetchdata={fetchData}
            idtrano={idtrano}
            fetchtrano={fetchtrano}
          />
        </div>
        <div className='pagination1'>
          <PaginationComponent
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            totalResults={totalResults}
            fetchData={fetchData}
          />
        </div>
      </div>
    </CustomModal>
  )
}

export default DonNo
