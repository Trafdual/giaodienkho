/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLeftLong, faPlus } from '@fortawesome/free-solid-svg-icons'
import { useToast } from '../../../components/GlobalStyles/ToastContext'

import { AddSanPham } from './AddSanPham'
function SanPhamLayout ({ opendetail, setopendetail, idloaisp }) {
  const [isOpen, setIsOpen] = useState(false)

  const [SanPham, setSanPham] = useState([])
  const { showToast } = useToast()

  // Trạng thái phân trang
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(9) // Mặc định là 9
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [khoID, setKhoID] = useState(localStorage.getItem('khoID') || '')

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

  const fetchData = async () => {
    if (!idloaisp) return

    try {
      const response = await fetch(
        `https://www.ansuataohanoi.com/getsanpham/${idloaisp}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        setSanPham(data)
      } else {
        console.error('Failed to fetch data')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [idloaisp])

  const postxuatkho = async idsp => {
    if (!idloaisp) return

    try {
      const response = await fetch(
        `https://www.ansuataohanoi.com/xuatkho/${idsp}/${idloaisp}/${khoID}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.ok) {
        showToast('xuất kho thành công')
        fetchData()
      } else {
        console.error('Failed to fetch data')
        showToast('Xuất kho thất bại')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

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
                      <td className='tdnhap'>Trạng thái xuất kho</td>
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
                          <td>{ncc.xuatStatus}</td>
                        </>
                      )}
                      <td className='tdchucnang'>
                        <button className='btnchitietncc'>
                          <h3>Chi tiết</h3>
                        </button>
                        <button className='btncnncc'>
                          <h3>Cập nhật</h3>
                        </button>
                        {ncc.xuatStatus === 'tồn kho' && (
                          <button
                            onClick={() => postxuatkho(ncc._id)}
                            className='btncnncc'
                          >
                            <h3>Xuất kho</h3>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={isMobile ? '3' : '7'}>
                      Không có sản phẩm nào
                    </td>
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
