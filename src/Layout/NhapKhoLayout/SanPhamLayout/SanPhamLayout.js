/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { AddSanPham } from './AddSanPham'
import { ModalXuatKho } from './ModalXuatkho'
import './SanPhamLayout.scss'
import EditSanPham from './EditSanPham/EditSanPham'
// import jsPDF from 'jspdf'
// import html2canvas from 'html2canvas'
// Component hiển thị khi đang loading

function SanPhamLayout ({
  idloaisp,
  fetchlohang,
  remainingHeight,
  loading,
  setLoading
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenXuakho, setIsOpenXuakho] = useState(false)
  const [SanPham, setSanPham] = useState([])
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [khoID, setKhoID] = useState(localStorage.getItem('khoID') || '')
  const [masku, setmasku] = useState('')
  const [isOpenEdit, setIsOpenEdit] = useState(false)
  // const [selectedItems, setSelectedItems] = useState([])
  // const [isOpenChuyenKhoFull, setIsOpenChuyenKhoFull] = useState(false)

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
  const Loading = () => {
    return (
      <div
        className='loading-container'
        style={{ height: `${remainingHeight}px` }}
      >
        <div className='spinner'></div>
        <h3 className='h3loading'>Loading...</h3>
      </div>
    )
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
  // const handleCloseModalChuyenKhoFull = () => {
  //   setIsOpenChuyenKhoFull(false)
  // }

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
        setLoading(false)
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

  // useEffect(() => {
  //   const eventSource = new EventSource('https://www.ansuataohanoi.com/events')

  //   eventSource.onmessage = event => {
  //     const newMessage = JSON.parse(event.data)
  //     showToast(newMessage.message)
  //     fetchData()
  //   }

  //   return () => {
  //     eventSource.close()
  //   }
  // }, [])

  const ModalEdit = sku => {
    setmasku(sku)
    setIsOpenEdit(true)
  }

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

              {/* <div
                className='action-menu'
                style={{ position: 'sticky', top: '30px' }}
              >
                <h4> sản phẩm được chọn</h4>
                <button
                  className={`btn-xoa ${!idloaisp ? 'disabled' : ''}`}
                  onClick={() => setIsOpen(true)}
                  disabled={!idloaisp}
                >
                  
                  Thêm sản phẩm
                </button>
              </div> */}

              <table className='tablenhap'>
                <thead className='theadnhap'>
                  <tr>
                    {/* <td className='tdnhap'>
                      <input
                        type='checkbox'
                        checked={selectAll}
                        onChange={handleSelectAll}
                      />
                    </td> */}
                    <td className='tdnhap'>Mã sku</td>
                    <td className='tdnhap'>Imel</td>
                    {!isMobile && (
                      <>
                        <td className='tdnhap'>Tên máy</td>
                        <td className='tdnhap'>Số lượng</td>
                        <td className='tdnhap'> Đơn giá</td>
                        <td className='tdnhap'>Thành tiền</td>
                      </>
                    )}

                    <td className='tdnhap'>Chức năng</td>
                  </tr>
                </thead>
                <tbody className='tbodynhap'>
                  {SanPham.length > 0 ? (
                    SanPham.map(ncc => (
                      <>
                        <tr key={ncc._id}>
                          {/* <td>
                            <input
                              type='checkbox'
                              checked={selectedItems.includes(ncc._id)}
                              onChange={() => handleSelectItem(ncc._id)}
                            />
                          </td> */}
                          <td>{ncc.masku}</td>
                          <td className='imei-cell'>{ncc.imel}</td>
                          {!isMobile && (
                            <>
                              <td className='imei-cell'>{ncc.name}</td>
                              <td>{ncc.quantity}</td>
                              <td>{ncc.price.toLocaleString()} VNĐ</td>
                              <td>{ncc.total.toLocaleString()} VNĐ</td>
                            </>
                          )}

                          <td className='tdchucnang'>
                            <button
                              className='btninimel'
                              onClick={() => ModalEdit(ncc.masku)}
                            >
                              Cập nhật
                            </button>
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
                          fetchlohang={fetchlohang}
                        />
                        {/* <ModalChuyenKhoFull
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
                        /> */}
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
            </div>
            <AddSanPham
              isOpen={isOpen}
              onClose={handleCloseModal}
              loaispid={idloaisp}
              setsanpham={setSanPham}
              fetchData={fetchData}
              fetchlohang={fetchlohang}
            />
            <EditSanPham
              sku={masku}
              idloaisp={idloaisp}
              isOpen={isOpenEdit}
              onClose={() => setIsOpenEdit(false)}
            />
          </div>
        </>
      )}
    </>
  )
}

export default SanPhamLayout