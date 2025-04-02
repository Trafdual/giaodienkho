/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Barcode from 'react-barcode'
import { Modal } from '../../components/Modal'
import { useToast } from '../../components/GlobalStyles/ToastContext'
import { ModalXuatKhoFull } from './ModalXuatKhoFull'
import { ModalXuatKho } from './ModalXuatkho'

import {
  faEye,
  faPen,
  faTrashCan,
  faTruckFast,
  faWarehouse
} from '@fortawesome/free-solid-svg-icons'
import './SearProductLayout.scss'
import PaginationComponent from '../../components/NextPage/PaginationComponent'

import { SanPhamGioHang } from './SanPhamGioHang'
import { ModalTraHang } from './ModalTraHang'
import { TroGiupLayout } from '../TroGiupLayout'
import { useNavigate } from 'react-router-dom'
import { getFromLocalStorage } from '../../components/MaHoaLocalStorage/MaHoaLocalStorage'

function SearchProductLayout () {
  const navigate = useNavigate()
  const location = useLocation()
  const { products } = location.state || { products: [] }
  const { showToast } = useToast()
  const [isOpenXuakho, setIsOpenXuakho] = useState(false)
  const [SanPham, setSanPham] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(9)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [khoID, setKhoID] = useState(localStorage.getItem('khoID') || '')
  const [selectAll, setSelectAll] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])
  const [isOpenChuyenKhoFull, setIsOpenChuyenKhoFull] = useState(false)
  const [printBarcodeItem, setPrintBarcodeItem] = useState(null)
  const [openModalbarcode, setOpenmodalbarcode] = useState(false)
  const [isOpenModalTraHang, setIsOpenModalTraHang] = useState(false)
  const [height, setHeight] = useState(400)
  const [isDragging, setIsDragging] = useState(false)
  const [startY, setStartY] = useState(0)
  const [resizerPosition, setResizerPosition] = useState(400)
  const [remainingHeight, setRemainingHeight] = useState(
    window.innerHeight - 500
  )
  const [isModalOpen, setModalOpen] = useState(false)
  const [currentImei, setCurrentImei] = useState(null)

  const userdata = getFromLocalStorage('data')


  const handleOpenModal = imei => {
    setCurrentImei(imei)
    setModalOpen(true)
  }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging])

  useEffect(() => {
    if (products && products.length > 0) {
      setSanPham(products)
    }
  }, [products])

  useEffect(() => {
    const savedSelectedItems = localStorage.getItem('selectedItems')
    if (savedSelectedItems) {
      setSelectedItems(JSON.parse(savedSelectedItems))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('selectedItems', JSON.stringify(selectedItems))
  }, [selectedItems])

  const handleSelectAll = () => {
    const newSelectAll = !selectAll
    setSelectAll(newSelectAll)

    if (newSelectAll) {
      setSelectedItems(SanPham)
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = item => {
    setSelectedItems(prevSelectedItems => {
      const isSelected = prevSelectedItems.find(
        selected => selected._id === item._id
      )
      if (isSelected) {
        return prevSelectedItems.filter(selected => selected._id !== item._id)
      } else {
        return [...prevSelectedItems, item]
      }
    })
  }

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

  useEffect(() => {
    const token =
      sessionStorage.getItem('token') || localStorage.getItem('token')
    if (!token) {
      navigate('/')
    }
  }, [navigate])

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

  // const handleCloseModalXuakho = () => {
  //   setIsOpenXuakho(false)
  // }

  const handleCloseModalChuyenKhoFull = () => {
    setIsOpenChuyenKhoFull(false)
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = SanPham.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(SanPham.length / itemsPerPage)
  const totalResults = SanPham.length

  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber)
  }
  const XuatKhoHangLoat = async () => {
    try {
      const response = await fetch(`http://localhost:3015/xuatkho1/${khoID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          idsanpham1: selectedItems
        })
      })
      const data = await response.json()

      if (data) {
        showToast(`Xuất kho thành công`)
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
  const clearsanpham = () => {
    setSanPham([])

    setSelectedItems([])
  }
  const totalAmount = currentItems.reduce(
    (sum, ncc) => sum + (ncc.tongtien || 0),
    0
  )

  const hasReturnProducts = products.some(
    product => product && product.tralai === true
  )

  return (
    <>
      <div className='detailsnhap'>
        <div
          className='recentsearch'
          style={{
            height: `${height}px`,
            overflow: 'auto',
            position: 'relative'
          }}
        >
          <div className='action-menu'>
            <h4>{selectedItems.length} sản phẩm được chọn</h4>
            <button
              className={`btn-xoa ${
                selectedItems.length > 1 ? 'disabled' : ''
              }`}
              disabled={selectedItems.length > 1}
            >
              <FontAwesomeIcon icon={faPen} className='iconMenuSanPham' />
              Sửa
            </button>
            <button
              className={`btn-xoa ${
                selectedItems.length > 1 ? 'disabled' : ''
              }`}
              disabled={selectedItems.length > 1}
            >
              <FontAwesomeIcon icon={faEye} className='iconMenuSanPham' />
              Xem
            </button>
            {(userdata.data.user[0].role === 'manager' ||
              userdata.data.user[0].quyen.includes('quanly')) && (
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
            <button
              className={`btn-xuat ${
                selectedItems.length === 0 ? 'disabled' : ''
              }`}
              disabled={selectedItems.length === 0}
              onClick={XuatKhoHangLoat}
            >
              <FontAwesomeIcon icon={faWarehouse} className='iconMenuSanPham' />
              Xuất kho
            </button>
            <button
              className={`btn-xuat ${
                selectedItems.length === 0 ? 'disabled' : ''
              }`}
              disabled={selectedItems.length === 0}
              onClick={() => setIsOpenChuyenKhoFull(true)}
            >
              <FontAwesomeIcon icon={faTruckFast} className='iconMenuSanPham' />
              Chuyển kho
            </button>
            <button
              className={`btn-xuat ${
                selectedItems.length === 0 ? 'disabled' : ''
              }`}
              disabled={selectedItems.length === 0}
              onClick={() => setIsOpenModalTraHang(true)}
            >
              <FontAwesomeIcon icon={faTruckFast} className='iconMenuSanPham' />
              Trả lại hàng mua
            </button>
          </div>

          <table className='tablenhap'>
            <thead className='theadnhap'>
              <tr>
                {!hasReturnProducts && (
                  <td className='tdnhap'>
                    <input
                      type='checkbox'
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                  </td>
                )}

                <td className='tdnhap'>Mã lô hàng</td>
                <td className='tdnhap'>Mã sản phẩm</td>
                <td className='tdnhap'>Imel</td>
                {!isMobile && (
                  <>
                    <td className='tdnhap'>Tên máy</td>
                    <td className='tdnhap'>Trạng thái xuất kho</td>
                    <td className='tdnhap'>Chức năng</td>
                  </>
                )}
              </tr>
            </thead>
            <tbody className='tbodynhap'>
              {currentItems.length > 0 ? (
                currentItems.map(ncc => (
                  <>
                    <tr key={ncc._id}>
                      {!ncc.tralai && (
                        <td>
                          <input
                            type='checkbox'
                            checked={selectedItems.some(
                              item => item._id === ncc._id
                            )} // Kiểm tra xem sản phẩm có trong selectedItems không
                            onChange={() => handleSelectItem(ncc)} // Gọi hàm để chọn hoặc bỏ chọn sản phẩm
                          />
                        </td>
                      )}
                      <td>{ncc.malohang}</td>
                      <td>{ncc.masp}</td>
                      <td>{ncc.imel}</td>
                      {!isMobile && (
                        <>
                          <td>{ncc.name}</td>

                          <td>
                            {ncc.tralai
                              ? 'đã trả lại'
                              : ncc.xuat
                              ? 'đã xuất'
                              : 'tồn kho'}
                          </td>
                        </>
                      )}
                      <td className='tdchucnang'>
                        <button className='btnchitietncc'>Chi tiết</button>
                        <button className='btncnncc'>Cập nhật</button>
                        <button onClick={() => handleOpenModal(ncc.imel)}>
                          In Tem IMEI
                        </button>
                      </td>
                    </tr>
                  </>
                ))
              ) : (
                <tr>
                  <td colSpan='9'>Không có sản phẩm nào!</td>
                </tr>
              )}
              <TroGiupLayout
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                imei={currentImei} // Truyền imei hiện tại vào modal
              />
            </tbody>
          </table>
        </div>
        <table className='tablenhap table-tong-cong'>
          <tbody>
            <tr>
              <td colSpan={isMobile ? 3 : 6} className='tdnhap'>
                <strong>Tổng cộng</strong>
              </td>
              {!isMobile && (
                <td className='tdnhap'>
                  <strong>{totalAmount.toLocaleString()} VNĐ</strong>
                </td>
              )}
              <td className='tdnhap'></td>
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
        />
        <div
          className='resizer'
          onMouseDown={handleMouseDown}
          style={{
            cursor: 'ns-resize',
            width: '100%',
            height: '3px',
            background: '#ccc',
            position: 'sticky',
            bottom: 0, // Đặt vị trí dính ở cuối
            left: 0,
            zIndex: 1 // Đảm bảo nằm trên các thành phần khác
          }}
        ></div>
      </div>
      {isOpenXuakho && <ModalXuatKho setIsOpenXuakho={setIsOpenXuakho} />}
      {isOpenChuyenKhoFull && (
        <ModalXuatKhoFull
          isOpen={isOpenChuyenKhoFull}
          onClose={handleCloseModalChuyenKhoFull}
          setIsOpenChuyenKhoFull={setIsOpenChuyenKhoFull}
          selectedItems={selectedItems}
          fetchData={clearsanpham}
        />
      )}
      {openModalbarcode && (
        <Modal
          onClose={() => setOpenmodalbarcode(false)}
          width='300px'
          height='300px'
          title='In tem Imel'
        >
          <Barcode value={printBarcodeItem} />
        </Modal>
      )}
      <SanPhamGioHang
        remainingHeight={remainingHeight}
        selectedsanpham={selectedItems}
        setSelectedSanPham={setSelectedItems}
        setselectAll={setSelectAll}
      />
      <ModalTraHang
        isOpen={isOpenModalTraHang}
        onClose={() => setIsOpenModalTraHang(false)}
        imellist={selectedItems}
        fetchData={clearsanpham}
      />
    </>
  )
}

export default SearchProductLayout
