/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import '../../ColumnResizer/columnResizer'
import { enableColumnResizing } from '../../ColumnResizer/columnResizer'

import { PaginationComponent } from '~/components/NextPage'
import { getFromLocalStorage } from '~/components/MaHoaLocalStorage/MaHoaLocalStorage'
import { useNavigate } from 'react-router-dom'
import { getApiUrl } from '~/api/api'
import { CustomModal } from '../../../components/CustomModal'
import { DonNo } from './DonNo'

function NoNhaCungCap ({ isOpen, onClose, idnhacungcap }) {
  const [data, setdata] = useState([])
  const [selectedItems, setSelectedItems] = useState([])

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(9)
  const [selectAll, setSelectAll] = useState(false)
  const [isOpenDonNo, setisOpenDonNo] = useState(false)
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
        `${getApiUrl('domain')}/getnonhacungcap/${idnhacungcap}`,
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
    if (isOpen && idnhacungcap) {
      fetchData()
    }
  }, [isOpen, idnhacungcap])

  useEffect(() => {
    enableColumnResizing('.tablenhap')
  }, [])

  const totalPages = Math.ceil(data.length / itemsPerPage)
  const totalResults = data.length

  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber)
  }

  const handleSelectAll = () => {
    const newSelectAll = !selectAll
    setSelectAll(newSelectAll)

    if (newSelectAll) {
      const allIds = data.map(item => item._id)
      setSelectedItems(allIds)
    } else {
      setSelectedItems([])
    }
  }
  const handleSelectItem = id => {
    let updatedSelectedItems = [...selectedItems]

    if (selectedItems.includes(id)) {
      updatedSelectedItems = updatedSelectedItems.filter(item => item !== id)
    } else {
      updatedSelectedItems.push(id)
    }

    setSelectedItems(updatedSelectedItems)
    setSelectAll(updatedSelectedItems.length === data.length)
  }

  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <div className='divnhacungcap'>
        <div className='detailsnhap'>
          <div className='recentOrdersnhap'>
            <div
              className='action-menu'
              style={{ position: 'sticky', top: '0px' }}
            >
              <h4>{selectedItems.length} Mã trả nợ được chọn</h4>
              <button
                className={`btn-xoa ${
                  selectedItems.length > 1 || selectedItems.length === 0
                    ? 'disabled'
                    : ''
                }`}
                disabled={
                  selectedItems.length > 1 || selectedItems.length === 0
                }
                onClick={() => setisOpenDonNo(true)}
              >
                <FontAwesomeIcon icon={faEye} className='iconMenuSanPham' />
                Đơn nợ
              </button>
            </div>
            <div className='table-container'>
              <table className='tablenhap'>
                <thead className='theadnhap'>
                  <tr>
                    <td className='thsmall'>
                      <input
                        type='checkbox'
                        checked={selectAll}
                        onChange={handleSelectAll}
                      />
                    </td>
                    <td className='thsmall'>STT</td>
                    <td>ID</td>
                    <td className='tdnhap'>Mã trả nợ</td>
                    <td className='tdnhap'>Tổng nợ</td>
                    <td className='tdnhap'>Đã trả</td>
                  </tr>
                </thead>
                <tbody className='tbodynhap'>
                  {data.length > 0 ? (
                    data.map((ncc, index) => (
                      <tr key={ncc._id}>
                        <td>
                          <input
                            type='checkbox'
                            checked={selectedItems.includes(ncc._id)}
                            onChange={() => {
                              handleSelectItem(ncc._id)
                            }}
                          />
                        </td>
                        <td>{index + 1}</td>
                        <td
                          style={{
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {ncc._id}
                        </td>
                        <td>{ncc.matrano || 'không có'}</td>
                        <td>{ncc.tongno}</td>
                        <td>{ncc.datra === false ? 'Chưa trả' : 'Đã trả'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan='6'>Không có Mã trả nợ nào</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {/* <Adddata
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
            /> */}
          <DonNo
            isOpen={isOpenDonNo}
            onClose={() => setisOpenDonNo(false)}
            idtrano={selectedItems[0]}
            fetchtrano={fetchData}
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

export default NoNhaCungCap
