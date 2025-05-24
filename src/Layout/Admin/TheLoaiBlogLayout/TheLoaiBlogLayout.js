/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import { FaEdit, FaPlus } from 'react-icons/fa'
import { FaBlog, FaTrashCan } from 'react-icons/fa6'
import { ModalDelete2 } from '~/components/ModalDelete2'
import { getApiUrl } from '../../../api/api'
import { PaginationComponent } from '../../../components/NextPage'
import { AddTheLoaiBlog } from './AddTheLoaiBlog'
import { EditTheLoaiBlog } from './EditTheLoaiBlog'
import { BlogLayout } from './BlogLayout'
import { fetchWithHMAC } from '../../../components/VerifyAxios'

function TheLoaiBlogLayout () {
  const [data, setdata] = useState([])

  const [isOpenAdd, setIsOpenAdd] = useState(false)
  const [isOpenDelete, setIsOpenDelete] = useState(false)
  const [isOpenEdit, setIsOpenEdit] = useState(false)
  const [isOpenBlog, setisOpenBlog] = useState(false)

  const [selectedIds, setSelectedIds] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(9)
  const [totalResults, setTotalResults] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const fetchdata = async () => {
    try {
      const response = await fetchWithHMAC(
        'GET',
        `${getApiUrl('domain')}/admin/theloaitrogiup`
      )
      if (response.ok) {
        const data = await response.json()
        setdata(data.data)
        setCurrentPage(data.page)
        setTotalPages(data.totalPages)
        setTotalResults(data.total)
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

  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber)
  }

  return (
    <div className='blogadmin_container'>
      <div className='nav_chucnang'>
        <button className='btnthemtheloai' onClick={() => setIsOpenAdd(true)}>
          <FaPlus className='icons' />
          Thêm thể loại blog
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
          Xóa thể loại blog
        </button>

        <button
          className='btnthemtheloai'
          onClick={() => {
            if (selectedIds.length === 0) {
              alert('Chọn một thể loại để xem blog')
            } else if (selectedIds.length > 1) {
              alert('Chỉ được chọn một thể loại để xem blog')
            } else {
              setisOpenBlog(true)
            }
          }}
        >
          <FaBlog className='icons' />
          Blog
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
              <th>ID</th>
              <th>Tên</th>
              <th>Tên không dấu</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
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
                  <td>{item.name}</td>
                  <td>{item.namekhongdau}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>Không có dữ liệu</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <AddTheLoaiBlog
        isOpen={isOpenAdd}
        onClose={() => setIsOpenAdd(false)}
        fetchdata={fetchdata}
      />
      <ModalDelete2
        isOpen={isOpenDelete}
        onClose={() => setIsOpenDelete(false)}
        content={'Bạn có muốn xóa những thể loại blog này?'}
        seletecids={selectedIds}
        fetchdata={fetchdata}
        link={`${getApiUrl('domain')}/admin/deletetheloaitg`}
        setSelectedIds={setSelectedIds}
        message={'xóa thành công'}
      />

      <EditTheLoaiBlog
        isOpen={isOpenEdit}
        onClose={() => setIsOpenEdit(false)}
        idtheloai={selectedIds[0]}
        fetchdata={fetchdata}
      />

      <BlogLayout
        isOpen={isOpenBlog}
        onClose={() => setisOpenBlog(false)}
        idtheloai={selectedIds[0]}
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

export default TheLoaiBlogLayout
