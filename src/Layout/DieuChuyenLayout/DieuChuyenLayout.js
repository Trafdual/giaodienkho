import { useState, useEffect } from 'react'

function DieuChuyenLayout () {
  const [lohang, setlohang] = useState([])
  const [khoID, setKhoID] = useState(localStorage.getItem('khoID') || '')

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

  useEffect(() => {
    console.log(localStorage.getItem('khoID'))
    let isMounted = true

    const fetchData = async () => {
      if (!khoID) return

      try {
        const response = await fetch(
          `https://www.ansuataohanoi.com/getdieuchuyen/${khoID}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )

        if (response.ok && isMounted) {
          const data = await response.json()
          setlohang(data)
        } else {
          console.error('Failed to fetch data')
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching data:', error)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [khoID])

  // Tính toán mục để hiển thị cho trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = lohang.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(lohang.length / itemsPerPage)

  // Chuyển trang
  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber)
  }

  return (
    <>
      <div className='detailsnhap'>
        <div className='recentOrdersnhap'>
          <div className='headernhap'>
            <h2 className='divncc'>Sản phẩm điều chuyển</h2>
          </div>
          <table className='tablenhap'>
            <thead className='theadnhap'>
              <tr>
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
    </>
  )
}

export default DieuChuyenLayout
