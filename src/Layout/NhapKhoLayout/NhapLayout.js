import './NhapKhoLayout.scss'
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { AddLoHang } from './AddLoHang'
import { SanPhamLayout } from './SanPhamLayout'

function NhapKhoLayout () {
  const [lohang, setlohang] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [opendetail, setopendetail] = useState(true)
  const [khoID, setKhoID] = useState(localStorage.getItem('khoID') || '')
  const [idlohang, setidlohang] = useState('')

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

  const handleLohang = id => {
    setidlohang(id)
    setopendetail(false)
  }

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
          `http://localhost:8080/getloaisanpham2/${khoID}`,
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
      {opendetail && (
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
                    </>
                  )}
                  <td className='tdnhap'>Chức năng</td>
                </tr>
              </thead>
              <tbody className='tbodynhap'>
                {currentItems.length > 0 ? (
                  currentItems.map(ncc => (
                    <tr key={ncc._id}>
                      <td>{ncc.malsp}</td>
                      <td>{ncc.name}</td>
                      <td>{ncc.soluong}</td>
                      {!isMobile && (
                        <>
                          <td>{ncc.date}</td>
                          <td>{ncc.tongtien}</td>
                          <td>{ncc.average}</td>
                        </>
                      )}
                      <td className='tdchucnang'>
                        <button
                          className='btnchitietncc'
                          onClick={() => handleLohang(ncc._id)}
                        >
                          <h3>Chi tiết</h3>
                        </button>
                        <button
                          className='btncnncc'
                          onClick={() => setIsOpen(true)}
                        >
                          <h3>Cập nhật</h3>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan='7'>Không có lô hàng nào</td>
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
        </div>
      )}
      <SanPhamLayout
        opendetail={opendetail}
        setopendetail={setopendetail}
        idloaisp={idlohang}
      />
    </>
  )
}

export default NhapKhoLayout
