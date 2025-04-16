import { useEffect, useState } from 'react'
import { getApiUrl } from '../../../../api/api'
import { PaginationComponent } from '../../../../components/NextPage'
import { CustomModal } from '../../../../components/CustomModal'
import { FaUsers } from 'react-icons/fa6'
import { NhanVienAdmin } from './NhanVienAdmin'

function KhoAdminLayout ({ isOpen, onClose, iduser }) {
  const [data, setdata] = useState([])
  const [selectedIds, setSelectedIds] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(9)
  const [totalResults, setTotalResults] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [isOpenNhanVien, setisOpenNhanVien] = useState(false)

  const fetchdata = async (page = 1) => {
    try {
      const response = await fetch(
        `${getApiUrl(
          'domain'
        )}/admin/getkhochua/${iduser}?page=${page}&limit=${itemsPerPage}`
      )
      if (response.ok) {
        const data = await response.json()
        setdata(data.data)
        setCurrentPage(data.currentPage)
        setTotalPages(data.totalPages)
        setTotalResults(data.totalItems)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (isOpen && iduser) {
      fetchdata()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, iduser])

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
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <div className='div_khoadmin_tong'>
        <div className='nav_chucnang'>
          <button
            className='btnthemtheloai'
            onClick={() => {
              if (selectedIds.length === 0) {
                alert('Chọn một user để xem kho chứa')
              } else if (selectedIds.length > 1) {
                alert('Chỉ được chọn một user để xem kho chứa')
              } else {
                setisOpenNhanVien(true)
              }
            }}
          >
            <FaUsers className='icons' />
            Nhân viên
          </button>
        </div>
        <div className='div_table_khoadmin'>
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
                <th>Tên kho</th>
                <th>Địa chỉ</th>
                <th>Nhân viên</th>
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
                    <td>{item.address}</td>
                    <td>{item.user}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='5'>Không có kho chứa</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <NhanVienAdmin
          isOpen={isOpenNhanVien}
          onClose={() => setisOpenNhanVien(false)}
          idkho={selectedIds[0]}
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
    </CustomModal>
  )
}

export default KhoAdminLayout
