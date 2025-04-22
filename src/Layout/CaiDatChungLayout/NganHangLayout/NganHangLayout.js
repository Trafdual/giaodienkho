/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'

import '../../ColumnResizer/columnResizer.scss'
import { enableColumnResizing } from '../../ColumnResizer/columnResizer'
import { Loading } from '~/components/Loading'

import { PaginationComponent } from '~/components/NextPage'
import { getFromLocalStorage } from '~/components/MaHoaLocalStorage/MaHoaLocalStorage'
import { useNavigate } from 'react-router-dom'
import { ModalDelete2 } from '~/components/ModalDelete2'
import { getApiUrl } from '~/api/api'

import { ModalAddNganHang } from '../../NhapKhoLayout/AddLoHang/ModalAddNganHang'
import { EditNganHang } from './EditNganHang'

function NganHangLayout () {
  const [sku, setsku] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenEdit, setIsOpenEdit] = useState(false)
  const [isLock, setIsLock] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedItems, setSelectedItems] = useState([])

  const [khoID, setKhoID] = useState(localStorage.getItem('khoID') || '')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(9)
  const [selectAll, setSelectAll] = useState(false)
  const [totalResults, setTotalResults] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const userdata = getFromLocalStorage('data')
  const navigate = useNavigate()

  useEffect(() => {
    const token = getFromLocalStorage('token')
    if (!token) {
      navigate('/')
    }
  }, [navigate])

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
    }, 1000)
    return () => clearInterval(intervalId)
  }, [localStorage.getItem('khoID')])

  const fetchData = async (page = 1) => {
    try {
      const response = await fetch(
        `${getApiUrl('domain')}/getnganhangadmin/${
          userdata.data.user[0]._id
        }?page=${page}&limit=${itemsPerPage}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        setsku(data.data) // Dữ liệu ngân hàng
        setCurrentPage(data.currentPage) // Trang hiện tại
        setTotalPages(data.totalPages) // Tổng số trang
        setTotalResults(data.totalItems) // Tổng số ngân hàng
        setLoading(false)
      } else {
        console.error('Failed to fetch data')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    if (khoID) {
      fetchData()
    }
  }, [khoID])

  useEffect(() => {
    enableColumnResizing('.tablenhap')
  }, [])

  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber)
  }

  const handleSelectAll = () => {
    const newSelectAll = !selectAll
    setSelectAll(newSelectAll)

    if (newSelectAll) {
      const allIds = sku.map(item => item._id)
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
    setSelectAll(updatedSelectedItems.length === sku.length)
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className='divnhanvien'>
          <div className='detailsnhap'>
            <div className='recentOrdersnhap'>
              <div
                className='action-menu'
                style={{ position: 'sticky', top: '0px' }}
              >
                <h4>{selectedItems.length} ngân hàng được chọn</h4>
                <button className={`btn-xoa `} onClick={() => setIsOpen(true)}>
                  <FontAwesomeIcon icon={faPlus} className='iconMenuSanPham' />
                  Thêm ngân hàng
                </button>

                <button
                  className={`btn-xoa ${
                    selectedItems.length > 1 || selectedItems.length === 0
                      ? 'disabled'
                      : ''
                  }`}
                  disabled={
                    selectedItems.length > 1 || selectedItems.length === 0
                  }
                  onClick={() => setIsOpenEdit(true)}
                >
                  <FontAwesomeIcon icon={faPen} className='iconMenuSanPham' />
                  Sửa
                </button>

                <button
                  className={`btn-xoa ${
                    selectedItems.length === 0 ? 'disabled' : ''
                  }`}
                  disabled={selectedItems.length === 0}
                  onClick={() =>
                    selectedItems.length > 0
                      ? setIsLock(true)
                      : alert('Chọn ngân hàng để xóa')
                  }
                >
                  <FontAwesomeIcon icon={faTrash} className='iconMenuSanPham' />
                  Xóa ngân hàng
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
                      <td className='tdnhap'>Mã</td>
                      <td className='tdnhap'>Tên ngân hàng</td>
                      <td className='tdnhap'>Số tài khoản</td>
                      <td className='tdnhap'>Chủ sở hữu</td>
                    </tr>
                  </thead>
                  <tbody className='tbodynhap'>
                    {sku.length > 0 ? (
                      sku.map((ncc, index) => (
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
                          <td>{ncc.manganhangkho}</td>
                          <td>{ncc.name}</td>
                          <td>{ncc.sotaikhoan}</td>
                          <td>{ncc.chusohuu}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan='7'>Không có ngân hàng nào</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <ModalAddNganHang
              isOpen={isOpen}
              onClose={handleCloseModal}
              userId={userdata.data.user[0]._id}
              fetchdata={fetchData}
            />
            <EditNganHang
              isOpen={isOpenEdit}
              onClose={() => setIsOpenEdit(false)}
              fetchdata={fetchData}
              idnganhang={selectedItems[0]}
            />
            <ModalDelete2
              isOpen={isLock}
              onClose={() => setIsLock(false)}
              seletecids={selectedItems}
              setSelectedIds={setSelectedItems}
              fetchdata={fetchData}
              link={`${getApiUrl('domain')}/deletenganhang`}
              content={'Bạn có chắc chắn xóa những ngân hàng này'}
              message={'xóa thành công'}
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
      )}
    </>
  )
}

export default NganHangLayout
