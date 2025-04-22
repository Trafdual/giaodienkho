import { useEffect, useState } from 'react'
import { getApiUrl } from '../../../../../api/api'
import { PaginationComponent } from '../../../../../components/NextPage'
import { CustomModal } from '../../../../../components/CustomModal'
import moment from 'moment'

function NhanVienAdmin ({ isOpen, onClose, idkho }) {
  const [data, setdata] = useState([])
  const [selectedIds, setSelectedIds] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(9)
  const [totalResults, setTotalResults] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const fetchdata = async (page = 1) => {
    try {
      const response = await fetch(
        `${getApiUrl(
          'domain'
        )}/admin/getnhanvienadmin/${idkho}?page=${page}&limit=${itemsPerPage}`
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
    if (isOpen && idkho) {
      fetchdata()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, idkho])

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
        <div className='div_table_khoadmin'>
          <table className='tablenhap'>
            <thead>
              <tr>
                <th className='thmedium'>
                  <input
                    type='checkbox'
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className='thmedium'>STT</th>
                <th>Tên tài khoản nhân viên</th>
                <th className='thmax'>Email</th>
                <th>Số điện thoại</th>
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
                    <td>{moment(item.ngaydangky).format('DD/MM/YYYY')}</td>
                    <td>{item.role}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='5'>Không có nhân viên</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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

export default NhanVienAdmin
