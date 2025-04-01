/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import { FaEdit, FaPlus } from 'react-icons/fa'
import { AddBlog } from './AddBlog'

import './BlogLayout.scss'
import { FaTrashCan } from 'react-icons/fa6'
import { ModalDelete2 } from '~/components/ModalDelete2'
function BlogLayout () {
  const [data, setdata] = useState([])

  const [isOpenAdd, setIsOpenAdd] = useState(false)
  const [isOpenDelete, setIsOpenDelete] = useState(false)
  const [isOpenEdit, setIsOpenEdit] = useState(false)

  const [selectedIds, setSelectedIds] = useState([])
  const [selectAll, setSelectAll] = useState(false)

  const fetchdata = async () => {
    try {
      const response = await fetch('https://baotech.shop/getalltrogiup')
      if (response.ok) {
        const data = await response.json()
        setdata(data)
      }
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    fetchdata()
  }, [])

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

  return (
    <div className='blogadmin_container'>
      <div className='nav_chucnang'>
        <button className='btnthemtheloai' onClick={() => setIsOpenAdd(true)}>
          <FaPlus className='icons' />
          Thêm Blog
        </button>
        <button
          className='btnthemtheloai'
          onClick={() => {
            if (selectedIds.length === 0) {
              alert('Chọn một Blog để cập nhật')
            } else if (selectedIds.length > 1) {
              alert('Chỉ được chọn một Blog để cập nhật')
            } else {
              setIsOpenEdit(true)
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
              ? setIsOpenDelete(true)
              : alert('Chọn một Blog để xóa')
          }
        >
          <FaTrashCan className='icons' />
          Xóa Blog
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
            <th>ID</th>
            <th>Ảnh</th>
            <th>Tiêu đề</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>
                <input
                  type='checkbox'
                  checked={selectedIds.includes(item._id)}
                  onChange={() => handleSelectItem(item._id)}
                />
              </td>
              <td>{index + 1}</td>
              <td>{item._id}</td>
              <td>
                <img src={`${item.image}`} alt='' />
              </td>
              <td>{item.tieude}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <AddBlog
        isOpen={isOpenAdd}
        onClose={() => setIsOpenAdd(false)}
        fetchdata={fetchdata}
      />
      <ModalDelete2
        isOpen={isOpenDelete}
        onClose={() => setIsOpenDelete(false)}
        content={'Bạn có muốn xóa những blog này?'}
        seletecids={selectedIds}
        fetchdata={fetchdata}
        link={'https://baotech.shop/deletetrogiup'}
        setSelectedIds={setSelectedIds}
      />
    </div>
  )
}

export default BlogLayout
