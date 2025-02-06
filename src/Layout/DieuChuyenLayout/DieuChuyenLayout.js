/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { useToast } from '../../components/GlobalStyles/ToastContext'
import { Loading } from '~/components/Loading'
import { PaginationComponent } from '~/components/NextPage'

function DieuChuyenLayout () {
  const { showToast } = useToast()
  const [lohang, setlohang] = useState([])
  const [khoID, setKhoID] = useState(localStorage.getItem('khoID') || '')

  // Trạng thái phân trang
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(9) // Mặc định là 9
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [selectAll, setSelectAll] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])
  const [loading, setLoading] = useState(true)

  const handleSelectAll = () => {
    const newSelectAll = !selectAll
    setSelectAll(newSelectAll)

    if (newSelectAll) {
      const allIds = lohang.map(item => item._id)
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
    setSelectAll(updatedSelectedItems.length === lohang.length)
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        // Giả sử 768px là kích thước cắt của điện thoại
        setItemsPerPage(5)
        setIsMobile(window.innerWidth <= 768)
      } else {
        setItemsPerPage(9)
      }
    }

    // Gọi hàm khi trang được tải
    handleResize()

    // Thay đổi itemsPerPage khi kích thước cửa sổ thay đổi
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newKhoID = localStorage.getItem('khoID') || ''
      if (newKhoID !== khoID) {
        console.log('Interval detected change, updating khoID:', newKhoID)
        setKhoID(newKhoID)
      }
    }, 1000) // Kiểm tra mỗi giây

    return () => clearInterval(intervalId)
  }, [khoID])
  const fetchData = async () => {
    if (!khoID) return

    try {
      const response = await fetch(
        `https://ansuataohanoi.com/getdieuchuyen/${khoID}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        setlohang(data)
        setLoading(false)
      } else {
        console.error('Failed to fetch data')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [khoID])

  // Tính toán mục để hiển thị cho trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = lohang.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(lohang.length / itemsPerPage)
  const totalResults = lohang.length

  // Chuyển trang
  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber)
  }

  const XoaHangLoat = async () => {
    try {
      const response = await fetch(
        `https://ansuataohanoi.com/deletedieuchuyen/${khoID}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            iddieuchuyen: selectedItems
          })
        }
      )
      const data = await response.json()

      if (data) {
        showToast(`Xóa thành công`)
        fetchData()
        setSelectedItems([])
        setSelectAll(false)
      } else {
        console.error('Failed to fetch data')
        showToast('xóa thất bại', 'error')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          ;
          <div className='detailsnhap'>
            <div className='recentOrdersnhap'>
              <div className='headernhap'>
                <h2 className='divncc'>Sản phẩm điều chuyển</h2>
              </div>
              {selectedItems.length > 0 && (
                <div className='action-menu'>
                  <h4>{selectedItems.length} sản phẩm được chọn</h4>
                  <button className='btn-xoa' onClick={XoaHangLoat}>
                    Xóa Tất Cả
                  </button>
                </div>
              )}

              <table className='tablenhap'>
                <thead className='theadnhap'>
                  <tr>
                    <td className='tdnhap'>
                      <input
                        type='checkbox'
                        checked={selectAll}
                        onChange={handleSelectAll}
                      />
                    </td>

                    <td className='tdnhap'>Mã Nhà Cung Cấp</td>
                    <td className='tdnhap'>Mã Lô Hàng</td>
                    <td className='tdnhap'>Mã Sản Phẩm</td>

                    {!isMobile && (
                      <>
                        <td className='tdnhap'>Tên Sản Phẩm</td>
                        <td className='tdnhap'>Trạng Thái</td>
                        <td className='tdnhap'>Ngày Điều Chuyển</td>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className='tbodynhap'>
                  {currentItems.length > 0 ? (
                    currentItems.map(ncc => (
                      <tr key={ncc._id}>
                        <td>
                          <input
                            type='checkbox'
                            checked={selectedItems.includes(ncc._id)}
                            onChange={() => handleSelectItem(ncc._id)}
                          />
                        </td>

                        <td>{ncc.mancc}</td>
                        <td>{ncc.malohang}</td>
                        <td>{ncc.masp}</td>

                        {!isMobile && (
                          <>
                            <td>{ncc.tenmay}</td>
                            <td>{ncc.trangthai}</td>
                            <td>{ncc.date}</td>
                          </>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan='7'>Không có sản phẩm nào</td>
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
                fetchData={fetchData}
              />
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default DieuChuyenLayout
