/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { useToast } from '../../components/GlobalStyles/ToastContext'
import { ModalTest } from './ModalTest'

function TestLayout () {
  const { showToast } = useToast()
  const [lohang, setlohang] = useState([])
  const [khoID, setKhoID] = useState(localStorage.getItem('khoID') || '')
  const [selectAll, setSelectAll] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])
  const [isOpen, setIsOpen] = useState(false)

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

  // Trạng thái phân trang
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(9) // Mặc định là 9
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

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
    try {
      const response = await fetch(`https://baominhmobile.com/testmodel`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setlohang(data)
      } else {
        console.error('Failed to fetch data')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Tính toán mục để hiển thị cho trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = lohang.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(lohang.length / itemsPerPage)

  // Chuyển trang
  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber)
  }

  const XoaHangLoat = async () => {
    try {
      const response = await fetch(
        `https://baotech.shop/deletexuatkho/${khoID}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            idsp: selectedItems
          })
        }
      )

      if (response.ok) {
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

  useEffect(() => {
    const eventSource = new EventSource('https://baotech.shop/events')

    eventSource.onmessage = event => {
      const newMessage = JSON.parse(event.data)
      showToast(newMessage.message)
      fetchData()
    }

    return () => {
      eventSource.close()
    }
  }, [])

  return (
    <>
      <div className='detailsnhap'>
        <div className='recentOrdersnhap'>
          <div className='headernhap'>
            <h2 className='divncc'>Test</h2>
            <button onClick={() => setIsOpen(true)}>Thêm Test</button>
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

                <td className='tdnhap'>Tên test</td>
              </tr>
            </thead>
            <tbody className='tbodynhap'>
              {currentItems.length > 0 ? (
                currentItems.map(ncc => (
                  <tr key={ncc._id}>
                    <td>{ncc.name}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='7'>Không có sản phẩm nào</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className='pagination'>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={index + 1 === currentPage ? 'active' : ''}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
      <ModalTest
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        fetchData={fetchData}
      />
    </>
  )
}

export default TestLayout
