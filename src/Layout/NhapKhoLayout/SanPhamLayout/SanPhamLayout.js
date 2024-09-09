import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLeftLong, faPlus } from '@fortawesome/free-solid-svg-icons'

import { AddSanPham } from './AddSanPham'
function SanPhamLayout ({ opendetail, setopendetail, idloaisp }) {
  const [isOpen, setIsOpen] = useState(false)

  const [SanPham, setSanPham] = useState([])
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

  const handleCloseModal = () => {
    setIsOpen(false)
  }

  useEffect(() => {
    console.log(idloaisp)
    let isMounted = true

    const fetchData = async () => {
      if (!idloaisp) return

      try {
        const response = await fetch(
          `http://localhost:8080/getsanpham/${idloaisp}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )

        if (response.ok && isMounted) {
          const data = await response.json()
          setSanPham(data)
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
  }, [idloaisp])

  // Tính toán mục để hiển thị cho trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = SanPham.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(SanPham.length / itemsPerPage)

  // Chuyển trang
  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber)
  }

  return (
    <>
      {!opendetail && (
        <div className='detailsnhap'>
          <div className='recentOrdersnhap'>
            <div className='headernhap'>
              <div className='divncc'>
                <FontAwesomeIcon
                  className='iconout'
                  icon={faLeftLong}
                  onClick={() => setopendetail(true)}
                />
                <h2 className='h2ncc'>Sản phẩm</h2>
              </div>
              <button className='btnthemlo' onClick={() => setIsOpen(true)}>
                <FontAwesomeIcon className='iconncc' icon={faPlus} />
                <h3>Thêm Sản Phẩm</h3>
              </button>
            </div>
            <table className='tablenhap'>
              <thead className='theadnhap'>
                <tr>
                  <td className='tdnhap'>Mã sản phẩm</td>
                  <td className='tdnhap'>Imel</td>
                  {!isMobile && (
                    <>
                      <td className='tdnhap'>Tên máy</td>
                      <td className='tdnhap'>Dung lượng</td>
                      <td className='tdnhap'>Màu sắc</td>
                    </>
                  )}
                  <td className='tdnhap'>Chức năng</td>
                </tr>
              </thead>
              <tbody className='tbodynhap'>
                {currentItems.length > 0 ? (
                  currentItems.map(ncc => (
                    <tr key={ncc._id}>
                      <td>{ncc.masp}</td>
                      <td>{ncc.imel}</td>
                      {!isMobile && (
                        <>
                          <td>{ncc.name}</td>
                          <td>{ncc.capacity}</td>
                          <td>{ncc.color}</td>
                        </>
                      )}
                      <td className='tdchucnang'>
                        <button className='btnchitietncc'>
                          <h3>Chi tiết</h3>
                        </button>
                        <button className='btncnncc'>
                          <h3>Cập nhật</h3>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={isMobile ? '3' : '6'}>Không có sản phẩm nào</td>
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
          <AddSanPham
            isOpen={isOpen}
            onClose={handleCloseModal}
            loaispid={idloaisp}
            setsanpham={setSanPham}
          />
        </div>
      )}
    </>
  )
}

export default SanPhamLayout
