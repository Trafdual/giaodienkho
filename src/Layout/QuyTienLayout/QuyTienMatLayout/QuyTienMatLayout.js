/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { Loading } from '~/components/Loading'
import { AddQuyTien } from '../AddQuyTien'
import { PaginationComponent } from '~/components/NextPage'
import ChiTietQuyTienMat from './ChiTietQuyTienMat'
import { useNavigate } from 'react-router-dom'
import { getApiUrl } from '../../../api/api'
import { getFromLocalStorage } from '../../../components/MaHoaLocalStorage/MaHoaLocalStorage'

function QuyTienMatLayout () {
  const [quytien, setquytien] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenAdd, setIsOpenAdd] = useState(false)
  const [khoID, setKhoID] = useState(localStorage.getItem('khoID') || '')
  const [idquytien, setidquytien] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  //   const [isOpenEdit, setIsOpenEdit] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)
  const [loadingsp, setLoadingsp] = useState(false)
  const [loaitien, setloaitien] = useState('')
  const method = 'Tiền mặt'
  //   const { showToast } = useToast()

  // Trạng thái phân trang
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  //   const [idloaisanpham, setIdloaisanpham] = useState(null)

  //xử lý kéo
  const [height, setHeight] = useState(400)
  const [isDragging, setIsDragging] = useState(false)
  const [startY, setStartY] = useState(0)
  const [resizerPosition, setResizerPosition] = useState(400)
  const [remainingHeight, setRemainingHeight] = useState(
    window.innerHeight - 500
  )

  useEffect(() => {
    const token = getFromLocalStorage('token')
    if (!token) {
      navigate('/')
    }
  }, [navigate])

  const handleMouseDown = e => {
    setIsDragging(true)
    setStartY(e.clientY)
    document.body.style.cursor = 'ns-resize' // Đổi con trỏ chuột
  }

  const handleMouseMove = e => {
    if (isDragging) {
      const newHeight = height + (e.clientY - startY)
      if (newHeight > 100 && newHeight <= 554) {
        // Đảm bảo chiều cao không nhỏ hơn 100px
        setHeight(newHeight)
        setResizerPosition(newHeight) // Cập nhật vị trí của resizer khi di chuyển
        setRemainingHeight(window.innerHeight - newHeight - 100)
      }
      setStartY(e.clientY)
      document.body.style.userSelect = 'none' // Ngăn chọn text khi kéo
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    document.body.style.cursor = 'auto' // Đổi con trỏ chuột về mặc định
    document.body.style.userSelect = 'auto'
  }

  useEffect(() => {
    // Thêm sự kiện mousemove và mouseup khi kéo
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  //hết kéo

  let isMounted = true

  const fetchData = async () => {
    if (!khoID) return

    try {
      const response = await fetch(
        `${getApiUrl('domain')}/getthuchitienmat/${khoID}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.ok && isMounted) {
        const data = await response.json()
        setquytien(data)
        setLoading(false)
      } else {
        console.error('Failed to fetch data')
      }
    } catch (error) {
      if (isMounted) {
        console.error('Error fetching data:', error)
      }
    }
  }

  const handleCloseModal = () => {
    setIsOpenAdd(false)
  }

  const handlequytien = useCallback(id => {
    setidquytien(id)
    setSelectedRow(id)
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
  const currentItems = quytien.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(quytien.length / itemsPerPage)
  const totalResults = quytien.length

  // Chuyển trang
  const handlePageChange = page => {
    setCurrentPage(page)
  }
  useEffect(() => {
    setLoading(true)
    fetchData()
  }, [khoID])

  const totalAmount = currentItems.reduce(
    (sum, ncc) => sum + (ncc.tongtien || 0),
    0
  )

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className='detailsnhapkho'>
            <div
              className='recentOrdersnhapkho'
              style={{
                height: `${height}px`,
                overflow: 'auto',
                position: 'relative'
              }}
            >
              <div
                className='action-menu-quytien'
                style={{ position: 'sticky', top: '0px' }}
              >
                <button
                  className={`btn-themquytien`}
                  onClick={() => setIsOpen(!isOpen)}
                  // disabled={!idloaisp}
                >
                  <FontAwesomeIcon icon={faPlus} className='iconMenuSanPham' />
                  Thêm quỹ tiền
                  <div
                    className={`caret1 ${isOpen ? 'carte-rotate1' : ''}`}
                  ></div>
                </button>

                {isOpen && (
                  <div className='dropdown-menu1'>
                    <ul>
                      <li
                        onClick={() => {
                          setIsOpenAdd(true)
                          setloaitien('Tiền thu')
                          setIsOpen(false)
                        }}
                      >
                        <button>Phiếu thu tiền</button>
                      </li>
                      <li
                        onClick={() => {
                          setIsOpenAdd(true)
                          setloaitien('Tiền chi')
                          setIsOpen(false)
                        }}
                      >
                        <button>Phiếu chi tiền</button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              <div className='divtablequytien'>
                <table className='tablenhap'>
                  <thead className='theadnhap'>
                    <tr>
                      <td className='tdnhap'>Ngày</td>
                      <td className='tdnhap'>Số chứng từ</td>
                      <td className='tdnhap'>Loại chứng từ</td>
                      <td className='tdnhap'>Tổng tiền</td>
                      <td className='tdnhap'>Đối tượng</td>
                      <td className='tdnhap'>Lý do</td>
                    </tr>
                  </thead>
                  <tbody className='tbodynhap'>
                    {currentItems.length > 0 ? (
                      currentItems.map(ncc => (
                        <>
                          <tr
                            key={ncc._id}
                            className={
                              selectedRow === ncc._id ? 'selectedrow' : ''
                            }
                            onClick={() => {
                              if (selectedRow !== ncc._id) {
                                handlequytien(ncc._id)
                                setLoadingsp(true)
                              }
                            }}
                            style={{ cursor: 'pointer' }}
                          >
                            <td>{ncc.date}</td>
                            <td>{ncc.mathuchi}</td>

                            <td>{ncc.loaichungtu}</td>
                            <td>
                              {ncc.tongtien ? ncc.tongtien.toLocaleString() : 0}
                              VNĐ
                            </td>
                            <td>{ncc.doituong}</td>
                            <td>{ncc.lydo}</td>
                          </tr>
                        </>
                      ))
                    ) : (
                      <tr>
                        <td colSpan='6'>Không có quỹ tiền nào</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <table className='tablenhap table-tong-cong'>
              <tbody>
                <tr>
                  <td colSpan={6} className='tdnhap'>
                    <strong>Tổng cộng</strong>
                  </td>
                  <td className='tdnhap'>
                    <strong>{totalAmount.toLocaleString()} VNĐ</strong>
                  </td>
                </tr>
              </tbody>
            </table>

            <PaginationComponent
              totalPages={totalPages}
              currentPage={currentPage}
              handlePageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              totalResults={totalResults}
              fetchData={fetchData}
            />
            <div
              className='resizer'
              onMouseDown={handleMouseDown}
              style={{
                cursor: 'ns-resize',
                width: '100%',
                height: '5px',
                background: '#ccc',
                position: 'sticky',
                bottom: 0, // Đặt vị trí dính ở cuối
                left: 0,
                zIndex: 1 // Đảm bảo nằm trên các thành phần khác
              }}
            ></div>

            <AddQuyTien
              isOpen={isOpenAdd}
              onClose={handleCloseModal}
              fetchquytien={fetchData}
              loaitien={loaitien}
              method={method}
            />
          </div>
          <ChiTietQuyTienMat
            remainingHeight={remainingHeight}
            idquytien={idquytien}
            loading={loadingsp}
            setLoading={setLoadingsp}
          />
        </>
      )}
    </>
  )
}

export default QuyTienMatLayout
