/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBarcode,
  faEye,
  faPen,
  faPlus,
  faTrashCan,
  faTruckFast,
  faWarehouse
} from '@fortawesome/free-solid-svg-icons'

import { AddSanPham } from './AddSanPham'
import { ModalXuatKho } from './ModalXuatkho'
import './SanPhamLayout.scss'
import { ModalChuyenKhoFull } from './ModalChuyenKhoFull'
import { useToast } from '../../../components/GlobalStyles/ToastContext'
import Barcode from 'react-barcode'
import { Modal } from '../../../components/Modal'
import { ModalXuaKhoFull } from './ModalXuaKhoFull'
// import jsPDF from 'jspdf'
// import html2canvas from 'html2canvas'
// Component hiển thị khi đang loading

function SanPhamLayout ({ idloaisp, fetchlohang, remainingHeight }) {
  const { showToast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenXuakho, setIsOpenXuakho] = useState(false)
  const [isOpenXuatKhoFull, setIsOpenXuatKhoFull] = useState(false)
  const [SanPham, setSanPham] = useState([])
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [khoID, setKhoID] = useState(localStorage.getItem('khoID') || '')
  const [selectAll, setSelectAll] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])
  const [isOpenChuyenKhoFull, setIsOpenChuyenKhoFull] = useState(false)
  const [printBarcodeItem, setPrintBarcodeItem] = useState(null)
  const [openModalbarcode, setOpenmodalbarcode] = useState(false)

  const handlePrintBarcode = imel => {
    setOpenmodalbarcode(true)
    setPrintBarcodeItem(imel) // Lưu lại sản phẩm cần in

    const checkIfElementReady = () => {
      const barcodeElement = document.querySelector('.barcode-print1')
      if (barcodeElement && barcodeElement.offsetHeight > 0) {
        window.print() // Thực hiện in khi barcode đã sẵn sàng
        setOpenmodalbarcode(false) // Đóng modal sau khi in xong
      } else {
        setTimeout(checkIfElementReady, 500) // Kiểm tra lại sau 500ms nếu chưa sẵn sàng
      }
    }

    setTimeout(checkIfElementReady, 500) // Kiểm tra sau 500ms
  }

  // const handleExportPDFBarcode = async imel => {
  //   setOpenmodalbarcode(true)
  //   setPrintBarcodeItem(imel) // Lưu lại sản phẩm cần xuất PDF

  //   // Đợi một chút để modal render xong
  //   setTimeout(async () => {
  //     const barcodeElement = document.querySelector('.barcode-print') // Chọn phần tử chứa mã barcode

  //     // Chụp ảnh phần tử barcode dưới dạng canvas
  //     const canvas = await html2canvas(barcodeElement, {
  //       scale: 2 // Tăng độ phân giải của ảnh lên để giữ chi tiết rõ nét hơn
  //     })

  //     const imgData = canvas.toDataURL('image/png') // Lấy dữ liệu hình ảnh

  //     const pdf = new jsPDF() // Tạo một đối tượng PDF

  //     // Lấy kích thước barcode từ canvas để chèn vào PDF với tỉ lệ chính xác
  //     const imgWidth = canvas.width / 4 // Tính toán chiều rộng (giảm bớt kích thước)
  //     const imgHeight = canvas.height / 4 // Tính toán chiều cao tương ứng

  //     pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight) // Thêm hình ảnh vào file PDF với kích thước chuẩn

  //     pdf.save(`${imel}_barcode.pdf`) // Lưu file PDF
  //     setOpenmodalbarcode(false) // Đóng modal sau khi xuất PDF xong
  //   }, 1000) // Đợi 1 giây để đảm bảo modal đã render
  // }

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
      console.log(idloaisp)

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
    fetchData()
  }, [idloaisp])

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:8080/events')

    eventSource.onmessage = event => {
      const newMessage = JSON.parse(event.data)
      showToast(newMessage.message)
      fetchData()
    }

    return () => {
      eventSource.close()
    }
  }, [])

  return (
    <>
      <div className='detailsnhapkho'>
        <div
          className='recentOrdersnhapkho'
          style={{
            height: `${remainingHeight}px`,
            overflow: 'auto',
            position: 'relative'
          }}
        >
          <div
            className='headernhap'
            style={{ position: 'sticky', top: '0px' }}
          >
            <div className='divncc'>
              <h2 className='h2ncc'>Sản phẩm</h2>
            </div>
          </div>

          <div
            className='action-menu'
            style={{ position: 'sticky', top: '30px' }}
          >
            <h4>{selectedItems.length} sản phẩm được chọn</h4>
            <button
              className={`btn-xoa ${!idloaisp ? 'disabled' : ''}`}
              onClick={() => setIsOpen(true)}
              disabled={!idloaisp}
            >
              <FontAwesomeIcon icon={faPlus} className='iconMenuSanPham' />
              Thêm sản phẩm
            </button>
            <button
              className={`btn-xoa ${
                selectedItems.length > 1 || selectedItems.length === 0
                  ? 'disabled'
                  : ''
              }`}
              disabled={selectedItems.length > 1 || selectedItems.length === 0}
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
              disabled={selectedItems.length > 1 || selectedItems.length === 0}
            >
              <FontAwesomeIcon icon={faEye} className='iconMenuSanPham' />
              Xem
            </button>

            <button
              className={`btn-xoa ${
                selectedItems.length === 0 ? 'disabled' : ''
              }`}
              disabled={selectedItems.length === 0}
            >
              <FontAwesomeIcon icon={faTrashCan} className='iconMenuSanPham' />
              Xóa
            </button>

            <button
              className={`btn-xuat ${
                selectedItems.length === 0 ? 'disabled' : ''
              }`}
              onClick={() => setIsOpenXuatKhoFull(true)}
              disabled={selectedItems.length === 0}
            >
              <FontAwesomeIcon icon={faWarehouse} className='iconMenuSanPham' />
              Xuất Kho
            </button>
            <button
              className={`btn-xuat ${
                selectedItems.length === 0 ? 'disabled' : ''
              }`}
              onClick={() => setIsOpenChuyenKhoFull(true)}
              disabled={selectedItems.length === 0}
            >
              <FontAwesomeIcon icon={faTruckFast} className='iconMenuSanPham' />
              Chuyển Kho
            </button>
            <button
              className={`btn-xuat ${
                selectedItems.length === 0 ? 'disabled' : ''
              }`}
              disabled={selectedItems.length === 0}
              onClick={() => handlePrintBarcode(selectedItems.imel)}
            >
              <FontAwesomeIcon icon={faBarcode} className='iconMenuSanPham' />
              In tem Imel
            </button>
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
                {/* <td className='tdnhap'>Chức năng</td> */}
              </tr>
            </thead>
            <tbody className='tbodynhap'>
              {SanPham.length > 0 ? (
                SanPham.map(ncc => (
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
                      {/* <td className='tdchucnang'>
                            <button
                              className='btninimel'
                              onClick={() => handleExportPDFBarcode(ncc.imel)}
                            >
                              xuất pdf
                            </button>
                          </td> */}
                    </tr>
                    <ModalXuatKho
                      isOpen={isOpenXuakho}
                      onClose={handleCloseModalXuakho}
                      setsanpham={setSanPham}
                      idsanpham={ncc._id}
                      idloaisp={idloaisp}
                      khoID={khoID}
                      fetchData={fetchData}
                      fetchlohang={fetchlohang}
                    />
                    <ModalChuyenKhoFull
                      isOpen={isOpenChuyenKhoFull}
                      onClose={handleCloseModalChuyenKhoFull}
                      selectedItems={selectedItems}
                      fetchData={fetchData}
                      setSelectedItems={setSelectedItems}
                      setSelectAll={setSelectAll}
                      fetchlohang={fetchlohang}
                    />
                    <ModalXuaKhoFull
                      isOpen={isOpenXuatKhoFull}
                      onClose={() => setIsOpenXuatKhoFull(false)}
                      selectedItems={selectedItems}
                      fetchData={fetchData}
                      setSelectedItems={setSelectedItems}
                      setSelectAll={setSelectAll}
                      fetchlohang={fetchlohang}
                      idloaisp={idloaisp}
                      khoID={khoID}
                    />
                  </>
                ))
              ) : (
                <tr>
                  <td colSpan={isMobile ? '4' : '8'}>Không có sản phẩm nào</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <AddSanPham
          isOpen={isOpen}
          onClose={handleCloseModal}
          loaispid={idloaisp}
          setsanpham={setSanPham}
          fetchData={fetchData}
          fetchlohang={fetchlohang}
        />

        <Modal
          isOpen={openModalbarcode}
          onClose={() => setOpenmodalbarcode(false)}
        >
          <div className='barcode-print'>
            <Barcode className='barcode-print1' value={printBarcodeItem} />
          </div>
        </Modal>
      </div>
    </>
  )
}

export default SanPhamLayout
