/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { FaEdit, FaPlus } from 'react-icons/fa'

import { FaLock } from 'react-icons/fa6'
import './UserLayout.scss'
import moment from 'moment'
import { getFromLocalStorage } from '~/components/MaHoaLocalStorage/MaHoaLocalStorage'
import { AddUser } from './AddUser'
import { EditUser } from './EditUser'
import { ModalDelete2 } from '~/components/ModalDelete2'
import { getApiUrl } from '../../../api/api'
import { PaginationComponent } from '../../../components/NextPage'
import { KhoAdminLayout } from './KhoAdminLayout'
import { fetchWithHMAC } from '../../../components/VerifyAxios'

function UserLayout () {
  const userdata = getFromLocalStorage('data')
  const [data, setData] = useState([])
  const [selectedIds, setSelectedIds] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenXoaTL, setisOpenXoaTL] = useState(false)
  const [isOpenCapNhat, setisOpenCapNhat] = useState(false)
  const [isOpenKhoChua, setisOpenKhoChua] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(9)
  const [totalResults, setTotalResults] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [isOpenDuyet, setisOpenDuyet] = useState(false)

  const fetchdata = async (page = 1) => {
    try {
      const response = await fetchWithHMAC(
        'GET',
        `${getApiUrl('domain')}/getuser/${
          userdata?.data.user[0]._id
        }?page=${page}&limit=${itemsPerPage}&khoa=false`
      )
      if (response.ok) {
        const data = await response.json()
        setCurrentPage(data.page)
        setTotalPages(data.totalPages)
        setTotalResults(data.total)
        setData(data.data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchdata()
  }, [userdata?.data.user[0]._id])

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([])
    } else {
      setSelectedIds(data.map(item => item._id))
    }
    setSelectAll(!selectAll)
  }

  const handleSelectItem = id => {
    let newSelectedIds = [...selectedIds]
    if (newSelectedIds.includes(id)) {
      newSelectedIds = newSelectedIds.filter(itemId => itemId !== id)
    } else {
      newSelectedIds.push(id)
    }
    setSelectedIds(newSelectedIds)

    setSelectAll(newSelectedIds.length === data.length)
  }
  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber)
  }

  const handleRoleChange = async (id, value) => {
    try {
      const response = await fetch(`${getApiUrl('domain')}/updaterole/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          role: value
        })
      })

      if (response.ok) {
        fetchdata()
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className='theloai_container'>
      <div className='nav_chucnang'>
        <button className='btnthemtheloai' onClick={() => setIsOpen(true)}>
          <FaPlus className='icons' />
          Thêm User
        </button>
        <button
          className='btnthemtheloai'
          onClick={() => {
            if (selectedIds.length === 0) {
              alert('Chọn một user để cập nhật')
            } else if (selectedIds.length > 1) {
              alert('Chỉ được chọn một user để cập nhật')
            } else {
              setisOpenCapNhat(true)
            }
          }}
        >
          <FaEdit className='icons' />
          Cập nhật
        </button>
        <button
          className='btnthemtheloai'
          onClick={() =>
            selectedIds.length > 0
              ? setisOpenXoaTL(true)
              : alert('Chọn user để khóa')
          }
        >
          <FaLock className='icons' />
          Khóa user
        </button>

        <button
          className='btnthemtheloai'
          onClick={() => {
            if (selectedIds.length === 0) {
              alert('Chọn một user để xem kho chứa')
            } else if (selectedIds.length > 1) {
              alert('Chỉ được chọn một user để xem kho chứa')
            } else {
              setisOpenKhoChua(true)
            }
          }}
        >
          <FaEdit className='icons' />
          Kho chứa
        </button>

        <button
          className='btnthemtheloai'
          onClick={() =>
            selectedIds.length > 0
              ? setisOpenDuyet(true)
              : alert('Chọn user để duyệt')
          }
        >
          <FaLock className='icons' />
          Duyệt user
        </button>
      </div>

      <div className='divbody_useradmin'>
        <table className='tablenhap'>
          <thead>
            <tr>
              <th className='thsmall'>
                <input
                  type='checkbox'
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              <th className='thsmall'>STT</th>
              <th>Họ và tên</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Ngày sinh</th>
              <th>Ngày đăng ký</th>
              <th>Quyền</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={item._id}>
                  <td>
                    <input
                      type='checkbox'
                      checked={selectedIds.includes(item._id)}
                      onChange={() => handleSelectItem(item._id)}
                    />
                  </td>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.phone}</td>
                  <td>{moment(item.birthday).format('DD/MM/YYYY')}</td>
                  <td>{moment(item.ngaydangky).format('DD/MM/YYYY')}</td>
                  <td>
                    <select
                      value={item.role}
                      className='custom-select'
                      onClick={e => e.stopPropagation()}
                      onChange={e => handleRoleChange(item._id, e.target.value)}
                    >
                      <option value='manager'>Manager</option>
                      <option value='admin'>Admin</option>
                    </select>
                  </td>
                  <td>{item.duyet ? 'Active' : 'Inactive'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='8'>Không có user</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AddUser
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        fetchdata={fetchdata}
      />
      <EditUser
        isOpen={isOpenCapNhat}
        onClose={() => setisOpenCapNhat(false)}
        fetchdata={fetchdata}
        iduser={selectedIds[0]}
      />
      <ModalDelete2
        isOpen={isOpenXoaTL}
        onClose={() => setisOpenXoaTL(false)}
        content={'Bạn có muốn khóa những user này?'}
        seletecids={selectedIds}
        fetchdata={fetchdata}
        link={`${getApiUrl('domain')}/admin/khoauser`}
        setSelectedIds={setSelectedIds}
        message={'khóa thành công'}
      />

      <ModalDelete2
        isOpen={isOpenDuyet}
        onClose={() => setisOpenDuyet(false)}
        content={'Bạn có muốn duyệt những user này?'}
        seletecids={selectedIds}
        fetchdata={fetchdata}
        link={`${getApiUrl('domain')}/duyetuser`}
        setSelectedIds={setSelectedIds}
        message={'duyệt thành công'}
      />
      <KhoAdminLayout
        isOpen={isOpenKhoChua}
        onClose={() => setisOpenKhoChua(false)}
        iduser={selectedIds[0]}
      />
      <div className='pagination1'>
        <PaginationComponent
          totalPages={totalPages}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          totalResults={totalResults}
          fetchData={fetchdata}
        />
      </div>
    </div>
  )
}

export default UserLayout
