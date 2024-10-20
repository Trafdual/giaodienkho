/* eslint-disable react-hooks/exhaustive-deps */
import './NhapKhoLayout.scss'
import { useState, useEffect, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { AddLoHang } from './AddLoHang'
import { SanPhamLayout } from './SanPhamLayout'
import { EditLoHang } from './EditLoHang'

function NhapKhoLayout () {
  const [lohang, setlohang] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [opendetail, setopendetail] = useState(true)
  const [khoID, setKhoID] = useState(localStorage.getItem('khoID') || '')
  const [idlohang, setidlohang] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingsanpham, setloadingsanpham] = useState(false)
  const [isOpenEdit, setIsOpenEdit] = useState(false)

  // Trạng thái phân trang
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(9) // Mặc định là 9
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [idloaisanpham, setIdloaisanpham] = useState(null)

  let isMounted = true

  const fetchData = async () => {
    if (!khoID) return

    try {
      const response = await fetch(
        `https://www.ansuataohanoi.com/getloaisanpham2/${khoID}`,
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

  const Loading = () => {
    return (
      <div className='loading-container'>
        <div className='spinner'></div>
        <h3 className='h3loading'>Loading...</h3>
      </div>
    )
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

  const handleCloseModal = () => {
    setIsOpen(false)
  }
  const handleCloseEdit = () => {
    setIsOpenEdit(false)
  }
  const handleEditClick = id => {
    setIdloaisanpham(id) // Lưu ID của sản phẩm cần cập nhật
    setIsOpenEdit(true) // Mở modal
  }

  const handleLohang = useCallback(id => {
    setidlohang(id)
    setloadingsanpham(true)
    setopendetail(false)
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

  // Tính toán mục để hiển thị cho trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = lohang.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(lohang.length / itemsPerPage)

  // Chuyển trang
  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber)
  }

  useEffect(() => {
    setLoading(true)
    fetchData()
    const timer = setTimeout(() => {
      setLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [khoID])

  return (
    <>
      {loading ? (
        <Loading /> // Hiển thị component Loading khi đang tải
      ) : (
        opendetail && (
          <div className='detailsnhap'>
            <div className='recentOrdersnhap'>
              <div className='headernhap'>
                <h2 className='divncc'>Lô hàng</h2>
                <button className='btnthemlo' onClick={() => setIsOpen(true)}>
                  <FontAwesomeIcon className='iconncc' icon={faPlus} />
                  <h3>Thêm lô hàng</h3>
                </button>
              </div>
              <table className='tablenhap'>
                <thead className='theadnhap'>
                  <tr>
                    <td className='tdnhap'>Mã lô hàng</td>
                    <td className='tdnhap'>Tên lô hàng</td>
                    <td className='tdnhap'>Số lượng máy</td>
                    {!isMobile && (
                      <>
                        <td className='tdnhap'>Ngày nhập</td>
                        <td className='tdnhap'>Tổng tiền</td>
                        <td className='tdnhap'>Trung bình máy</td>
                        <td className='tdnhap'>Còn lại máy</td>
                      </>
                    )}
                    <td className='tdnhap'>Chức năng</td>
                  </tr>
                </thead>
                <tbody className='tbodynhap'>
                  {currentItems.length > 0 ? (
                    currentItems.map(ncc => (
                      <>
                        <tr key={ncc._id}>
                          <td>{ncc.malsp}</td>
                          <td>{ncc.name}</td>
                          <td>{ncc.soluong}</td>
                          {!isMobile && (
                            <>
                              <td>{ncc.date}</td>
                              <td>
                                {ncc.tongtien
                                  ? ncc.tongtien.toLocaleString()
                                  : 0}{' '}
                                VNĐ
                              </td>
                              <td>
                                {ncc.average ? ncc.average.toLocaleString() : 0}{' '}
                                VNĐ
                              </td>
                              <td>{ncc.conlai}</td>
                            </>
                          )}
                          <td className='tdchucnang'>
                            <button
                              className='btnchitietncc'
                              onClick={() => handleLohang(ncc._id)}
                            >
                              Chi tiết
                            </button>
                            <button
                              className='btncnncc'
                              onClick={() => handleEditClick(ncc._id)}
                            >
                              Cập nhật
                            </button>
                          </td>
                        </tr>
                      </>
                    ))
                  ) : (
                    <tr>
                      <td colSpan='8'>Không có lô hàng nào</td>
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
            <AddLoHang
              isOpen={isOpen}
              onClose={handleCloseModal}
              setlohang={setlohang}
            />
            <EditLoHang
              idloaisanpham={idloaisanpham}
              isOpen={isOpenEdit}
              onClose={handleCloseEdit}
              fetchlohang={fetchData}
            />
          </div>
        )
      )}
      <SanPhamLayout
        opendetail={opendetail}
        setopendetail={setopendetail}
        idloaisp={idlohang}
        setloadingsanpham={setloadingsanpham}
        loadingsanpham={loadingsanpham}
        fetchlohang={fetchData}
      />
    </>
  )
}

export default NhapKhoLayout
