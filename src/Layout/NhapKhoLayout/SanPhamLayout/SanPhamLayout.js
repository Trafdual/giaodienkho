/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLeftLong, faPlus } from '@fortawesome/free-solid-svg-icons'

import { AddSanPham } from './AddSanPham'
import { ModalXuatKho } from './ModalXuatkho'
import './SanPhamLayout.scss'
import { ModalXuatKhoFull } from './ModalXuatKhoFull'
import { useToast } from '../../../components/GlobalStyles/ToastContext'

// Component hiển thị khi đang loading


function SanPhamLayout ({ opendetail, setopendetail, idloaisp }) {
  const { showToast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenXuakho, setIsOpenXuakho] = useState(false)
  const [SanPham, setSanPham] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(9)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [khoID, setKhoID] = useState(localStorage.getItem('khoID') || '')
  const [loading, setLoading] = useState(true) // Trạng thái loading
  const [selectAll, setSelectAll] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])
  const [isOpenChuyenKhoFull, setIsOpenChuyenKhoFull] = useState(false)

  const Loading = () => {
  return (
    <div className='loading-container'>
      <div className='spinner'></div>
      <h3 className='h3loading'>Loading...</h3>
    </div>
  )
}

  const handleSelectAll = () => {
    const newSelectAll = !selectAll
    setSelectAll(newSelectAll)

    if (newSelectAll) {
      const allIds = SanPham.map(item => item._id)
      setSelectedItems(allIds)
    } else {
      setSelectedItems([])
    }
  }
  const OpenDetail = () => {
    setopendetail(true)
    setSelectedItems([])
    setSelectAll(false)
  }

  const handleSelectItem = id => {
    let updatedSelectedItems = [...selectedItems]

    if (selectedItems.includes(id)) {
      updatedSelectedItems = updatedSelectedItems.filter(item => item !== id)
    } else {
      updatedSelectedItems.push(id)
    }

    setSelectedItems(updatedSelectedItems)
    setSelectAll(updatedSelectedItems.length === SanPham.length)
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
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setItemsPerPage(5)
        setIsMobile(window.innerWidth <= 768)
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

  const handleCloseModal = () => {
    setIsOpen(false)
  }
  const handleCloseModalXuakho = () => {
    setIsOpenXuakho(false)
  }
  const handleCloseModalChuyenKhoFull = () => {
    setIsOpenChuyenKhoFull(false)
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

  // Sử dụng useEffect để tạo thời gian chờ loading 5 giây
  useEffect(() => {
    setLoading(true)
    fetchData()
    const timer = setTimeout(() => {
      setLoading(false) // Sau 5 giây, tắt trạng thái loading
    }, 3000)

    return () => clearTimeout(timer) // Dọn dẹp bộ hẹn giờ nếu component bị hủy
  }, [idloaisp])

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = SanPham.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(SanPham.length / itemsPerPage)

  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber)
  }
  const XuatKhoHangLoat = async () => {
    try {
      const response = await fetch(
        `https://www.ansuataohanoi.com/xuatkho1/${idloaisp}/${khoID}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            idsanpham1: selectedItems
          })
        }
      )
      const data = await response.json()

      if (data) {
        showToast(`Xuất kho thành công`)
        fetchData()
        setSelectedItems([])
        setSelectAll(false)
      } else {
        console.error('Failed to fetch data')
        showToast('xuất kho thất bại', 'error')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  return (
    <>
      {loading ? (
        <Loading /> // Hiển thị loading nếu đang tải
      ) : (
        !opendetail && (
          <div className='detailsnhap'>
            <div className='recentOrdersnhap'>
              <div className='headernhap'>
                <div className='divncc'>
                  <FontAwesomeIcon
                    className='iconout'
                    icon={faLeftLong}
                    onClick={OpenDetail}
                  />
                  <h2 className='h2ncc'>Sản phẩm</h2>
                </div>
                <button className='btnthemlo' onClick={() => setIsOpen(true)}>
                  <FontAwesomeIcon className='iconncc' icon={faPlus} />
                  <h3>Thêm Sản Phẩm</h3>
                </button>
              </div>
              {selectedItems.length > 0 && (
                <div className='action-menu'>
                  <h4>{selectedItems.length} sản phẩm được chọn</h4>
                  <button className='btn-xoa'>Xóa Tất Cả</button>
                  <button className='btn-xuat' onClick={XuatKhoHangLoat}>
                    Xuất Tất Cả
                  </button>
                  <button
                    className='btn-xuat'
                    onClick={() => setIsOpenChuyenKhoFull(true)}
                  >
                    Chuyển Kho
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
                      <>
                        <tr key={ncc._id}>
                          <td>
                            <input
                              type='checkbox'
                              checked={selectedItems.includes(ncc._id)}
                              onChange={() => handleSelectItem(ncc._id)}
                            />
                          </td>
                          <td>{ncc.masp}</td>
                          <td>{ncc.imel}</td>
                          {!isMobile && (
                            <>
                              <td>{ncc.name}</td>
                              <td>{ncc.capacity}</td>
                              <td>{ncc.color}</td>
                              <td>{ncc.xuat ? 'đã xuất' : 'tồn kho'}</td>
                            </>
                          )}
                          <td className='tdchucnang'>
                            <button className='btnchitietncc'>
                              <h3>Chi tiết</h3>
                            </button>
                            <button className='btncnncc'>
                              <h3>Cập nhật</h3>
                            </button>
                            {ncc.xuat === false && (
                              <button
                                onClick={() => setIsOpenXuakho(true)}
                                className='btncnncc'
                              >
                                <h3>Xuất kho</h3>
                              </button>
                            )}
                          </td>
                        </tr>
                        <ModalXuatKho
                          isOpen={isOpenXuakho}
                          onClose={handleCloseModalXuakho}
                          setsanpham={setSanPham}
                          idsanpham={ncc._id}
                          idloaisp={idloaisp}
                          khoID={khoID}
                          fetchData={fetchData}
                        />
                        <ModalXuatKhoFull
                          isOpen={isOpenChuyenKhoFull}
                          onClose={handleCloseModalChuyenKhoFull}
                          selectedItems={selectedItems}
                          fetchData={fetchData}
                          setSelectedItems={setSelectedItems}
                          setSelectAll={setSelectAll}
                        />
                      </>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={isMobile ? '4' : '8'}>
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
              fetchData={fetchData}
            />
          </div>
        )
      )}
    </>
  )
}

export default SanPhamLayout
