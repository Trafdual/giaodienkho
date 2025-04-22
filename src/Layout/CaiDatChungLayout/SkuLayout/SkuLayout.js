/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEye,
  faPen,
  faPlus,
  faTrash
} from '@fortawesome/free-solid-svg-icons'

import '../../ColumnResizer/columnResizer.scss'
import { enableColumnResizing } from '../../ColumnResizer/columnResizer'
import { Loading } from '~/components/Loading'
import { ModalAddSku } from '../../NhapKhoLayout/SanPhamLayout/AddSanPham/AddTest/ModalAddSku'
// import { Editsku } from './Editsku'
import { PaginationComponent } from '~/components/NextPage'
import { getFromLocalStorage } from '~/components/MaHoaLocalStorage/MaHoaLocalStorage'
import { useNavigate } from 'react-router-dom'
import { ModalDelete2 } from '~/components/ModalDelete2'
import { getApiUrl } from '~/api/api'
import { DungLuongSku } from './DungLuongSku'
import { EditSku } from './EditSku'

function SkuLayout () {
  const [sku, setsku] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenEdit, setIsOpenEdit] = useState(false)
  const [isLock, setIsLock] = useState(false)
  const [isOpenDungluongsku, setisOpenDungluongsku] = useState(false)

  const [idncc, setidncc] = useState('')
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
        `${getApiUrl('domain')}/getsku/${
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
        setsku(data.data) // Dữ liệu mã sku
        setCurrentPage(data.currentPage) // Trang hiện tại
        setTotalPages(data.totalPages) // Tổng số trang
        setTotalResults(data.totalItems) // Tổng số mã sku
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
      setidncc(allIds.length === 1 ? allIds[0] : '')
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
                <h4>{selectedItems.length} Mã sku được chọn</h4>
                <button className={`btn-xoa `} onClick={() => setIsOpen(true)}>
                  <FontAwesomeIcon icon={faPlus} className='iconMenuSanPham' />
                  Thêm mã sku
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
                    selectedItems.length > 1 || selectedItems.length === 0
                      ? 'disabled'
                      : ''
                  }`}
                  disabled={
                    selectedItems.length > 1 || selectedItems.length === 0
                  }
                  onClick={() => setisOpenDungluongsku(true)}
                >
                  <FontAwesomeIcon icon={faEye} className='iconMenuSanPham' />
                  Xem
                </button>

                <button
                  className={`btn-xoa ${
                    selectedItems.length === 0 ? 'disabled' : ''
                  }`}
                  disabled={selectedItems.length === 0}
                  onClick={() =>
                    selectedItems.length > 0
                      ? setIsLock(true)
                      : alert('Chọn sku để xóa')
                  }
                >
                  <FontAwesomeIcon icon={faTrash} className='iconMenuSanPham' />
                  Xóa sku
                </button>
              </div>
              <div className='table-container'>
                <table className='tablenhap'>
                  <thead className='theadnhap'>
                    <tr>
                      <td>
                        <input
                          type='checkbox'
                          checked={selectAll}
                          onChange={handleSelectAll}
                        />
                      </td>
                      <td>STT</td>
                      <td>ID</td>
                      <td className='tdnhap'>Mã sku</td>
                      <td className='tdnhap'>Tên sku</td>
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
                                setidncc(ncc._id)
                              }}
                            />
                          </td>
                          <td>{index + 1}</td>
                          <td>{ncc._id}</td>
                          <td>{ncc.masku}</td>
                          <td>{ncc.name}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan='9'>Không có mã sku nào</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <ModalAddSku
              isOpen={isOpen}
              onClose={handleCloseModal}
              userID={userdata.data.user[0]._id}
              fetchsku={fetchData}
            />
            <EditSku
              isOpen={isOpenEdit}
              onClose={() => setIsOpenEdit(false)}
              fetchsku={fetchData}
              idsku={selectedItems[0]}
            />
            <ModalDelete2
              isOpen={isLock}
              onClose={() => setIsLock(false)}
              seletecids={selectedItems}
              setSelectedIds={setSelectedItems}
              fetchdata={fetchData}
              link={`${getApiUrl('domain')}/deletesku`}
              content={'Bạn có chắc chắn xóa những mã sku này'}
              message={'xóa thành công'}
            />
            <DungLuongSku
              isOpen={isOpenDungluongsku}
              onClose={() => setisOpenDungluongsku(false)}
              idsku={selectedItems[0]}
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

export default SkuLayout
