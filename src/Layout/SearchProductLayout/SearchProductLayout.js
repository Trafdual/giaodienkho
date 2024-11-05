import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Barcode from 'react-barcode'
import { Modal } from '../../components/Modal'
import { useToast } from '../../components/GlobalStyles/ToastContext'
import { ModalXuatKhoFull } from './ModalXuatKhoFull'
import { ModalXuatKho } from './ModalXuatkho'

import {
  faBarcode,
  faEye,
  faPen,
  faTrashCan,
  faTruckFast,
  faWarehouse
} from '@fortawesome/free-solid-svg-icons'
import './SearProductLayout.scss'
import PaginationComponent from '../../components/NextPage/PaginationComponent';

import { SanPhamGioHang } from './SanPhamGioHang'
import { ModalTraHang } from './ModalTraHang'
import { TroGiupLayout } from '../TroGiupLayout'

function SearchProductLayout() {
  const location = useLocation()
  const { products } = location.state || { products: [] }
  console.log(products)
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
  const [selectedImei, setSelectedImei] = useState('');
  const [height, setHeight] = useState(400)
  const [isDragging, setIsDragging] = useState(false)
  const [startY, setStartY] = useState(0)
  const [resizerPosition, setResizerPosition] = useState(400)
  const [remainingHeight, setRemainingHeight] = useState(
    window.innerHeight - 500
  )
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentImei, setCurrentImei] = useState(null); // State để lưu imei hiện tại

  const handleOpenModal = (imei) => {
    setCurrentImei(imei); // Đặt imei hiện tại
    setModalOpen(true); // Mở modal
  };
  // Xử lý khi kéo
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
      setSelectedItems(JSON.parse(savedSelectedItems)) // Khôi phục danh sách đã chọn từ localStorage
    }
  }, [])

  // Lưu danh sách sản phẩm đã chọn vào localStorage mỗi khi selectedItems thay đổi
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
        setItemsPerPage(5)
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

  const handleCloseModalXuakho = () => {
    setIsOpenXuakho(false)
  }

  const handleCloseModalChuyenKhoFull = () => {
    setIsOpenChuyenKhoFull(false)
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = SanPham.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(SanPham.length / itemsPerPage)
  const totalResults = SanPham.length;

  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber)
  }
  const XuatKhoHangLoat = async () => {
    try {
      const response = await fetch(
        `https://www.ansuataohanoi.com/xuatkho1/${khoID}`,
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
    // Cập nhật selectedItems trong state
    setSanPham([])

    // Đặt selectedItems trong localStorage về mảng rỗng
    setSelectedItems([])
  }
  const totalAmount = currentItems.reduce((sum, ncc) => sum + (ncc.tongtien || 0), 0);

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
              className={`btn-xoa ${selectedItems.length > 1 ? 'disabled' : ''
                }`}
              disabled={selectedItems.length > 1}
            >
              <FontAwesomeIcon icon={faPen} className='iconMenuSanPham' />
              Sửa
            </button>
            <button
              className={`btn-xoa ${selectedItems.length > 1 ? 'disabled' : ''
                }`}
              disabled={selectedItems.length > 1}
            >
              <FontAwesomeIcon icon={faEye} className='iconMenuSanPham' />
              Xem
            </button>
            <button
              className={`btn-xoa ${selectedItems.length === 0 ? 'disabled' : ''
                }`}
              disabled={selectedItems.length === 0}
            >
              <FontAwesomeIcon icon={faTrashCan} className='iconMenuSanPham' />
              Xóa
            </button>
            <button
              className={`btn-xuat ${selectedItems.length === 0 ? 'disabled' : ''
                }`}
              disabled={selectedItems.length === 0}
              onClick={XuatKhoHangLoat}
            >
              <FontAwesomeIcon icon={faWarehouse} className='iconMenuSanPham' />
              Xuất kho
            </button>
            <button
              className={`btn-xuat ${selectedItems.length === 0 ? 'disabled' : ''
                }`}
              disabled={selectedItems.length === 0}
              onClick={() => setIsOpenChuyenKhoFull(true)}
            >
              <FontAwesomeIcon icon={faTruckFast} className='iconMenuSanPham' />
              Chuyển kho
            </button>
            <button
              className={`btn-xuat ${selectedItems.length === 0 ? 'disabled' : ''
                }`}
              disabled={selectedItems.length === 0}
              onClick={() => setIsOpenModalTraHang(true)}
            >
              <FontAwesomeIcon icon={faTruckFast} className='iconMenuSanPham' />
              Trả lại hàng mua
            </button>

            {/* <button
              className={`btn-xuat ${
                selectedItems.length === 0 ? 'disabled' : ''
              }`}
              disabled={selectedItems.length === 0}
              onClick={() => handlePrintBarcode(selectedItems.imel)}
            >
              <FontAwesomeIcon icon={faBarcode} className='iconMenuSanPham' />
              In tem Imel
            </button> */}
          </div>

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
                <td className='tdnhap'>Mã lô hàng</td>
                <td className='tdnhap'>Mã sản phẩm</td>
                <td className='tdnhap'>Imel</td>
                {!isMobile && (
                  <>
                    <td className='tdnhap'>Tên máy</td>
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
                          checked={selectedItems.some(
                            item => item._id === ncc._id
                          )} // Kiểm tra xem sản phẩm có trong selectedItems không
                          onChange={() => handleSelectItem(ncc)} // Gọi hàm để chọn hoặc bỏ chọn sản phẩm
                        />
                      </td>
                      <td>{ncc.malohang}</td>
                      <td>{ncc.masp}</td>
                      <td>{ncc.imel}</td>
                      {!isMobile && (
                        <>
                          <td>{ncc.name}</td>

                          <td>{ncc.xuat ? 'đã xuất' : 'tồn kho'}</td>
                        </>
                      )}
                      <td className='tdchucnang'>
                        <button className='btnchitietncc'>Chi tiết</button>
                        <button className='btncnncc'>Cập nhật</button>
                        <button onClick={() => handleOpenModal(ncc.imel)}>In Tem IMEI</button>
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
              <td colSpan={isMobile ? 3 : 6} className='tdnhap'><strong>Tổng cộng</strong></td>
              {!isMobile && (
                <td className='tdnhap'><strong>{totalAmount.toLocaleString()} VNĐ</strong></td>
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
      />
      <ModalTraHang
        isOpen={isOpenModalTraHang}
        onClose={() => setIsOpenModalTraHang(false)}
      />

    </>
  )
}

export default SearchProductLayout
