/* eslint-disable react-hooks/exhaustive-deps */
import './NhapKhoLayout.scss'
import { useState, useEffect, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus,
  faEye,
  faPen,
  faTrashCan
} from '@fortawesome/free-solid-svg-icons'
import { SanPhamLayout } from './SanPhamLayout'
import { EditLoHang } from './EditLoHang'
import { Loading } from '~/components/Loading'
import { AddTest } from './SanPhamLayout/AddSanPham/AddTest'
import { PostImel } from './SanPhamLayout/AddSanPham/PostImel'
import PaginationComponent from '../../components/NextPage/PaginationComponent'
import { useToast } from '~/components/GlobalStyles/ToastContext'
import { getFromLocalStorage } from '~/components/MaHoaLocalStorage/MaHoaLocalStorage'
import { useNavigate } from 'react-router-dom'

function NhapKhoLayout () {
  const navigate = useNavigate()
  const [lohang, setlohang] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenPostimel, setIsOpenPostImel] = useState(false)
  const [khoID, setKhoID] = useState(localStorage.getItem('khoID') || '')
  const [idlohang, setidlohang] = useState('')
  const [loading, setLoading] = useState(true)
  const [isOpenEdit, setIsOpenEdit] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)
  const [loadingsp, setLoadingsp] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [malohang, setmalohang] = useState('')
  const { showToast } = useToast()

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  const [height, setHeight] = useState(400)
  const [isDragging, setIsDragging] = useState(false)
  const [startY, setStartY] = useState(0)
  // eslint-disable-next-line no-unused-vars
  const [resizerPosition, setResizerPosition] = useState(400)
  const [remainingHeight, setRemainingHeight] = useState(
    window.innerHeight - 500
  )
  const userdata = getFromLocalStorage('data')

  useEffect(() => {
    const token =
      sessionStorage.getItem('token') || localStorage.getItem('token')
    if (!token) {
      navigate('/')
    }
  }, [navigate])

  const handleMouseDown = e => {
    setIsDragging(true)
    setStartY(e.clientY)
    document.body.style.cursor = 'ns-resize'
  }

  const handleMouseMove = e => {
    if (isDragging) {
      const newHeight = height + (e.clientY - startY)
      if (newHeight > 100 && newHeight <= 554) {
        setHeight(newHeight)
        setResizerPosition(newHeight)
        setRemainingHeight(window.innerHeight - newHeight - 100)
      }
      setStartY(e.clientY)
      document.body.style.userSelect = 'none'
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    document.body.style.cursor = 'auto'
    document.body.style.userSelect = 'auto'
  }

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  let isMounted = true

  const fetchData = async () => {
    if (!khoID) return

    try {
      const response = await fetch(
        `https://ansuataohanoi.com/getloaisanpham2/${khoID}`,
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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setItemsPerPage(5)
        setIsMobile(window.innerWidth <= 768)
      } else {
        setItemsPerPage(5)
      }
    }

    handleResize()

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
  const handleEditClick = () => {
    if (selectedItems.length === 1) {
      setIsOpenEdit(true)
    }
    if (selectedItems.length === 0) {
      showToast('Vui lòng chọn 1 lô hàng để cập nhật', 'warning')
    }
    if (selectedItems.length > 1) {
      showToast(' Bạn chỉ được chọn 1 lô hàng để cập nhật', 'warning')
    }
  }

  const handleLohang = useCallback(id => {
    setidlohang(id)
    setSelectedRow(id)
  }, [])

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newKhoID = localStorage.getItem('khoID') || ''
      if (newKhoID !== khoID) {
        console.log('Interval detected change, updating khoID:', newKhoID)
        setKhoID(newKhoID)
      }
    }, 1000)

    return () => clearInterval(intervalId)
  }, [khoID])

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = lohang.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(lohang.length / itemsPerPage)
  const totalResults = lohang.length

  const handlePageChange = page => {
    setCurrentPage(page)
  }
  useEffect(() => {
    setLoading(true)
    fetchData()
  }, [khoID])
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
  const totalAmount = currentItems.reduce(
    (sum, ncc) => sum + (ncc.tongtien || 0),
    0
  )

  const handlePostlohang = async () => {
    try {
      const response = await fetch(
        `https://ansuataohanoi.com/postloaisanpham5/${khoID}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      const data = await response.json()
      if (response.ok) {
        setmalohang(data.malsp)
        setIsOpen(true)
      }
    } catch (error) {
      console.error('Error fetching:', error)
    }
  }

  useEffect(() => {
    const eventSource = new EventSource('https://ansuataohanoi.com/events')

    eventSource.onmessage = event => {
      fetchData()
    }

    return () => {
      eventSource.close()
    }
  }, [])

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
                className='action-menu'
                style={{ position: 'sticky', top: '0px' }}
              >
                <h4>{selectedItems.length} lô hàng được chọn</h4>
                {isMobile ? (
                  <button
                    className={`btn-xoa `}
                    onClick={() => setIsOpenPostImel(true)}
                  >
                    <FontAwesomeIcon
                      icon={faPlus}
                      className='iconMenuSanPham'
                    />
                    Thêm lô hàng
                  </button>
                ) : (
                  <button
                    className={`btn-xoa `}
                    onClick={() => handlePostlohang()}
                  >
                    <FontAwesomeIcon
                      icon={faPlus}
                      className='iconMenuSanPham'
                    />
                    Thêm lô hàng
                  </button>
                )}
                <button
                  className={`btn-xoa ${
                    selectedItems.length > 1 || selectedItems.length === 0
                      ? 'disabled'
                      : ''
                  }`}
                  disabled={
                    selectedItems.length > 1 || selectedItems.length === 0
                  }
                  onClick={() => handleEditClick()}
                >
                  <FontAwesomeIcon icon={faPen} className='iconMenuSanPham' />
                  Sửa
                </button>
                <button
                  className={`btn-xoa ${
                    selectedItems.length > 1 || selectedItems.length === 0
                      ? 'disabled'
                      : ''
                  }`}
                  disabled={
                    selectedItems.length > 1 || selectedItems.length === 0
                  }
                >
                  <FontAwesomeIcon icon={faEye} className='iconMenuSanPham' />
                  Xem
                </button>

                {userdata.data.user[0].role === 'manager' && (
                  <button
                    className={`btn-xoa ${
                      selectedItems.length === 0 ? 'disabled' : ''
                    }`}
                    disabled={selectedItems.length === 0}
                  >
                    <FontAwesomeIcon
                      icon={faTrashCan}
                      className='iconMenuSanPham'
                    />
                    Xóa
                  </button>
                )}
              </div>
              <div className='divtablenhapkho'>
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
                      <td className='tdnhap'>
                        {isMobile ? 'Mã' : 'Mã lô hàng'}
                      </td>
                      <td className='tdnhap'>
                        {isMobile ? 'Tên' : 'Tên lô hàng'}
                      </td>
                      <td className='tdnhap'>
                        {isMobile ? 'Ngày' : 'Ngày nhập'}
                      </td>

                      <td className='tdnhap'>Tổng tiền</td>
                      <td className='tdnhap'>
                        {isMobile ? 'Tồn' : 'Còn lại máy'}
                      </td>
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
                                handleLohang(ncc._id)
                                setLoadingsp(true)
                              }
                            }}
                            style={{ cursor: 'pointer' }}
                          >
                            <td className='tdnhap'>
                              <input
                                type='checkbox'
                                checked={selectedItems.includes(ncc._id)}
                                onChange={() => handleSelectItem(ncc._id)}
                              />
                            </td>
                            <td>{ncc.malsp}</td>
                            <td>{ncc.name}</td>
                            <td>
                              {isMobile
                                ? ncc.date
                                  ? new Date(
                                      typeof ncc.date === 'string' &&
                                      ncc.date.includes('/')
                                        ? ncc.date
                                            .split('/')
                                            .reverse()
                                            .join('-') // Chuyển từ DD/MM/YYYY -> YYYY-MM-DD
                                        : ncc.date
                                    ).toLocaleDateString('vi-VN', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: '2-digit'
                                    })
                                  : ''
                                : ncc.date
                                ? ncc.date
                                : ''}
                            </td>
                            <td>
                              {isMobile
                                ? ncc.tongtien
                                  ? `${(ncc.tongtien / 1000).toLocaleString()}k`
                                  : 0
                                : ncc.tongtien
                                ? ncc.tongtien.toLocaleString()
                                : 0}
                              VNĐ
                            </td>
                            <td>{ncc.conlai}</td>
                            {/* <td className='tdchucnang'>
                            <button
                              className='btncnncc'
                              onClick={() => handleEditClick(ncc._id)}
                            >
                              Cập nhật
                            </button>
                          </td> */}
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
              </div>
            </div>
            <table className='tablenhap table-tong-cong'>
              <tbody>
                <tr>
                  <td colSpan={isMobile ? 3 : 6} className='tdnhap'>
                    <strong>Tổng cộng</strong>
                  </td>
                  <td className='tdnhap'>
                    <strong>{totalAmount.toLocaleString()} VNĐ</strong>
                  </td>

                  {!isMobile && <td className='tdnhap'></td>}
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
                bottom: 0,
                left: 0,
                zIndex: 1
              }}
            ></div>

            <AddTest
              isOpen={isOpen}
              onClose={handleCloseModal}
              fetclohang={fetchData}
              malohang={malohang}
            />
            <EditLoHang
              idloaisanpham={selectedItems[0]}
              isOpen={isOpenEdit}
              onClose={handleCloseEdit}
              fetchlohang={fetchData}
            />
          </div>
          <SanPhamLayout
            remainingHeight={remainingHeight}
            idloaisp={idlohang}
            fetchlohang={fetchData}
            loading={loadingsp}
            setLoading={setLoadingsp}
          />
          <PostImel
            isOpen={isOpenPostimel}
            onClose={() => setIsOpenPostImel(false)}
          />
        </>
      )}
    </>
  )
}

export default NhapKhoLayout
