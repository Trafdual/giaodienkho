/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { AddKhachHang } from './AddKhachHang'
import { Loading } from '~/components/Loading'
import { getFromLocalStorage } from '~/components/MaHoaLocalStorage/MaHoaLocalStorage'
import { PaginationComponent } from '~/components/NextPage'
import './KhacHangLayout.scss'
import { getApiUrl } from '../../api/api'

function KhachHangLayout () {
  const [isOpen, setIsOpen] = useState(false)
  const [khachhang, setkhachhang] = useState([])
  const [khoID, setKhoID] = useState(localStorage.getItem('khoID') || '')
  const [loading, setLoading] = useState(true)

  // Trạng thái phân trang
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(9) // Mặc định là 9
  const userId = getFromLocalStorage('userId') || ''

  const handleCloseModal = () => {
    setIsOpen(false)
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setItemsPerPage(5)
      } else {
        setItemsPerPage(9)
      }
    }

    handleResize()

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
        `${getApiUrl('domain')}/getkhachhang/${khoID}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        setkhachhang(data)
        setLoading(false)
      } else {
        console.error('Failed to fetch data')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    console.log(localStorage.getItem('khoID'))
    fetchData()
  }, [khoID])

  // Tính toán mục để hiển thị cho trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = khachhang.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(khachhang.length / itemsPerPage)
  const totalResults = khachhang.length

  // Chuyển trang
  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber)
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className='divkhachhang'>
          <div className='detailsnhap'>
            <div className='recentOrdersnhap'>
              <div className='headernhap'>
                <h2 className='divncc'>Khách Hàng</h2>
                <button className='btnthemlo' onClick={() => setIsOpen(true)}>
                  <FontAwesomeIcon className='iconncc' icon={faPlus} />
                  <h3>Thêm khách hàng</h3>
                </button>
              </div>
              <div className='divtablekhachhang'>
                <table className='tablenhap'>
                  <thead className='theadnhap'>
                    <tr>
                      <td className='tdnhap'>Mã Khách Hàng</td>
                      <td className='tdnhap'>Tên Khách Hàng</td>
                      <td className='tdnhap'>Số Điện Thoại</td>

                      <td className='tdnhap'>CCCD</td>
                      <td className='tdnhap'>Email</td>
                      <td className='tdnhap'>Ngày Sinh</td>
                      <td className='tdnhap'>Địa Chỉ</td>
                    </tr>
                  </thead>
                  <tbody className='tbodynhap'>
                    {currentItems.length > 0 ? (
                      currentItems.map(ncc => (
                        <tr key={ncc._id}>
                          <td>{ncc.makh}</td>
                          <td>{ncc.name}</td>
                          <td>{ncc.phone}</td>

                          <td>{ncc.cancuoc}</td>
                          <td>{ncc.email}</td>
                          <td>{ncc.date}</td>
                          <td>{ncc.address}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan='7'>Không có khách hàng nào</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <AddKhachHang
            isOpen={isOpen}
            onClose={handleCloseModal}
            khoID={khoID}
            setkhachhang={setkhachhang}
            fetchData={fetchData}
            userId={userId}
          />
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
      )}
    </>
  )
}

export default KhachHangLayout
