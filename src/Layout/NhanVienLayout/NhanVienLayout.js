/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEye,
  faKey,
  faLock,
  faPen,
  faPlus,
  faUserTie
} from '@fortawesome/free-solid-svg-icons'
import '../ColumnResizer/columnResizer.scss'
import { enableColumnResizing } from '../ColumnResizer/columnResizer'
import { Loading } from '~/components/Loading'

import { AddNhanVien } from './AddNhanVien'
// import { EditNhanVien } from './EditNhanVien'
import { PaginationComponent } from '~/components/NextPage'
import { getFromLocalStorage } from '~/components/MaHoaLocalStorage/MaHoaLocalStorage'
import { useNavigate } from 'react-router-dom'
import { EditNhanVien } from './EditNhanVien'
import { EditPassword } from './EditPassword'
import { ModalDelete2 } from '~/components/ModalDelete2'
import { AddQuyen } from './AddQuyen'
import { getApiUrl } from '../../api/api'

function NhanVienLayout () {
  const [nhanvien, setnhanvien] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenEdit, setIsOpenEdit] = useState(false)
  const [isOpenEditPassword, setIsOpenEditPassword] = useState(false)
  const [isLock, setIsLock] = useState(false)
  const [isOpenAddQuyen, setIsOpenAddQuyen] = useState(false)

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
        `${getApiUrl('domain')}/getnhanvien/${
          userdata.data.user[0]._id
        }?page=${page}&limit=${itemsPerPage}&status=active`,
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
                <button className={`btn-xoa `} onClick={() => setIsOpen(true)}>
                  <FontAwesomeIcon icon={faPlus} className='iconMenuSanPham' />
                  Thêm nhân viên
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
                >
                  <FontAwesomeIcon icon={faEye} className='iconMenuSanPham' />
                  Xem
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
                  onClick={() => setIsOpenEditPassword(true)}
                >
                  <FontAwesomeIcon icon={faKey} className='iconMenuSanPham' />
                  Cập nhật mật khẩu
                </button>

                <button
                  className={`btn-xoa ${
                    selectedItems.length === 0 ? 'disabled' : ''
                  }`}
                  disabled={selectedItems.length === 0}
                  onClick={() => setIsLock(true)}
                >
                  <FontAwesomeIcon icon={faLock} className='iconMenuSanPham' />
                  Khóa nhân viên
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
                  onClick={() => setIsOpenAddQuyen(true)}
                >
                  <FontAwesomeIcon
                    icon={faUserTie}
                    className='iconMenuSanPham'
                  />
                  Cho phép quyền
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
                                setidncc(ncc._id)
                              }}
                            />
                          </td>
                          <td>{ncc.manhanvien}</td>
                          <td>{ncc.hovaten}</td>
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
            <AddNhanVien
              isOpen={isOpen}
              onClose={handleCloseModal}
              khoID={khoID}
              fetchData={fetchData}
            />
            <EditNhanVien
              isOpen={isOpenEdit}
              onClose={() => setIsOpenEdit(false)}
              idncc={idncc}
              fetchdata={fetchData}
              setidncc={setidncc}
            />
            <EditPassword
              isOpen={isOpenEditPassword}
              onClose={() => setIsOpenEditPassword(false)}
              idncc={idncc}
              fetchdata={fetchData}
            />
            <ModalDelete2
              isOpen={isLock}
              onClose={() => setIsLock(false)}
              seletecids={selectedItems}
              setSelectedIds={setSelectedItems}
              fetchdata={fetchData}
              link={`${getApiUrl('domain')}/khoanhanvien`}
              content={'Bạn có chắc chắn khóa những nhân viên này'}
              message={'khóa thành công'}
            />
            <AddQuyen
              isOpen={isOpenAddQuyen}
              onClose={() => setIsOpenAddQuyen(false)}
              idncc={idncc}
              fetchdata={fetchData}
              userid={userdata.data.user[0]._id}
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

export default NhanVienLayout
