/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { FaEdit, FaPlus } from 'react-icons/fa'

import { FaTrashCan } from 'react-icons/fa6'
import './UserLayout.scss'
import moment from 'moment'
import { getFromLocalStorage } from '~/components/MaHoaLocalStorage/MaHoaLocalStorage'
import { AddUser } from './AddUser'
import { ModalDelete2 } from '~/components/ModalDelete2'
import { getApiUrl } from '../../../api/api'

function UserLayout () {
  const userdata = getFromLocalStorage('data')
  const [data, setData] = useState([])
  const [selectedIds, setSelectedIds] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenXoaTL, setisOpenXoaTL] = useState(false)
  const [isOpenCapNhat, setisOpenCapNhat] = useState(false)

  const fetchdata = async () => {
    try {
      const response = await fetch(
        `${getApiUrl('backend')}/getuser/${userdata.data.user[0]._id}`
      )
      if (response.ok) {
        const data = await response.json()
        setData(data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchdata()
  }, [userdata.data.user[0]._id])

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

  //   const handleRoleChange = async (id, value) => {
  //     try {
  //       const response = await fetch(`http://localhost:8080/setrole/${id}`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json'
  //         },
  //         body: JSON.stringify({
  //           role: value
  //         })
  //       })

  //       if (response.ok) {
  //         fetchdata()
  //       }
  //     } catch (error) {
  //       console.error(error)
  //     }
  //   }

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
              : alert('Chọn user để xóa')
          }
        >
          <FaTrashCan className='icons' />
          Xóa user
        </button>
      </div>

      <table className='tablenhap'>
        <thead>
          <tr>
            <th>
              <input
                type='checkbox'
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </th>
            <th>STT</th>
            <th>Họ và tên</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Ngày sinh</th>
            <th>Ngày đăng ký</th>
            <th>Quyền</th>
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
                  <select value={item.role} className='custom-select'>
                    <option value='manager'>Manager</option>
                    <option value='admin'>Admin</option>
                  </select>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='8'>Không có user</td>
            </tr>
          )}
        </tbody>
      </table>
      <AddUser
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        fetchdata={fetchdata}
      />
      <ModalDelete2
        isOpen={isOpenXoaTL}
        onClose={() => setisOpenXoaTL(false)}
        content={'Bạn có muốn xóa những user này?'}
        seletecids={selectedIds}
        fetchdata={fetchdata}
        link={`${getApiUrl('domain')}/deleteuser`}
        setSelectedIds={setSelectedIds}
      />
    </div>
  )
}

export default UserLayout
