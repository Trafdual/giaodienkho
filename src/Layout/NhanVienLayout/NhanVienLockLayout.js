/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLockOpen } from '@fortawesome/free-solid-svg-icons'
import '../ColumnResizer/columnResizer.scss'
import { enableColumnResizing } from '../ColumnResizer/columnResizer'
import { Loading } from '~/components/Loading'

// import { EditNhanVien } from './EditNhanVien'
import { PaginationComponent } from '~/components/NextPage'
import { getFromLocalStorage } from '~/components/MaHoaLocalStorage/MaHoaLocalStorage'
import { useNavigate } from 'react-router-dom'

import { ModalDelete2 } from '~/components/ModalDelete2'
import { getApiUrl } from '../../api/api'

function NhanVienLockLayout () {
  const [nhanvien, setnhanvien] = useState([])

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
    const token =
      sessionStorage.getItem('token') || localStorage.getItem('token')
    if (!token) {
      navigate('/')
    }
  }, [navigate])

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
        `${getApiUrl('domain')}/getnhanvien/${
          userdata.data.user[0]._id
        }?page=${page}&limit=${itemsPerPage}&status=locked`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        setnhanvien(data.data) // Dữ liệu nhân viên
        setCurrentPage(data.page) // Trang hiện tại
        setTotalPages(data.totalPages) // Tổng số trang
        setTotalResults(data.total) // Tổng số nhân viên
        setLoading(false)

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
      const allIds = nhanvien.map(item => item._id)
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
    setSelectAll(updatedSelectedItems.length === nhanvien.length)
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
                <h4>{selectedItems.length} nhân viên được chọn</h4>

                {userdata.data.user[0].role === 'manager' && (
                  <button
                    className={`btn-xoa ${
                      selectedItems.length === 0 ? 'disabled' : ''
                    }`}
                    disabled={selectedItems.length === 0}
                    onClick={() => setIsLock(true)}
                  >
                    <FontAwesomeIcon
                      icon={faLockOpen}
                      className='iconMenuSanPham'
                    />
                    Mở khóa nhân viên
                  </button>
                )}
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
                      <td className='tdnhap'>Mã nhân viên</td>
                      <td className='tdnhap'>Tên nhân viên</td>
                      <td className='tdnhap'>Số điện thoại</td>
                      <td className='tdnhap'>Email</td>
                      <td className='tdnhap'>Tên tài khoản</td>
                      <td className='tdnhap'>Mật khẩu tài khoản</td>
                      <td className='tdnhap'>Chức vụ</td>
                      <td className='tdnhap'>Ngày tạo</td>
                    </tr>
                  </thead>
                  <tbody className='tbodynhap'>
                    {nhanvien.length > 0 ? (
                      nhanvien.map(ncc => (
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
                          <td>{ncc.manhanvien}</td>
                          <td>{ncc.name}</td>
                          <td>{ncc.phone}</td>
                          <td>{ncc.email}</td>
                          <td>{ncc.name}</td>
                          <td>{ncc.password}</td>
                          <td>{ncc.chucvu}</td>
                          <td>{ncc.date}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan='9'>Không có nhân viên nào</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <ModalDelete2
              isOpen={isLock}
              onClose={() => setIsLock(false)}
              seletecids={selectedItems}
              setSelectedIds={setSelectedItems}
              fetchdata={fetchData}
              link={`${getApiUrl('domain')}/mokhoanhanvien`}
              content={'Bạn có chắc chắn mở khóa những nhân viên này'}
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

export default NhanVienLockLayout
