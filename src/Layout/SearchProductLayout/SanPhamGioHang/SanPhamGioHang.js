import React, { useState } from 'react'
import './SanPhamGioHang.scss'

function SanPhamGioHang ({
  remainingHeight,
  selectedsanpham,
  setSelectedSanPham,
  setselectAll
}) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [checkedItems, setCheckedItems] = useState([]) // Trạng thái lưu sản phẩm được chọn

  // Hàm xử lý khi chọn/bỏ chọn một sản phẩm
  const handleCheckboxChange = id => {
    setCheckedItems(
      prevCheckedItems =>
        prevCheckedItems.includes(id)
          ? prevCheckedItems.filter(itemId => itemId !== id) // Bỏ chọn nếu đã có
          : [...prevCheckedItems, id] // Thêm vào danh sách nếu chưa có
    )
  }

  // Hàm xử lý xóa sản phẩm đã chọn
  const handleDeleteSelected = () => {
    const updatedSanPham = selectedsanpham.filter(
      sanpham => !checkedItems.includes(sanpham._id)
    )
    setSelectedSanPham(updatedSanPham) 
    setCheckedItems([]) 
    setselectAll(false)
  }

  return (
    <>
      <div className='detailsnhap'>
        <div
          className='recentsearch'
          style={{
            height: `${remainingHeight}px`,
            overflow: 'auto',
            position: 'relative'
          }}
        >
          <div className='headernhap'>
            <h2>Sản phẩm đã chọn</h2>
            {checkedItems.length > 0 && (
              <button onClick={handleDeleteSelected} className='btnxoaspCheck'>
                Xóa Sản Phẩm Đã Chọn
              </button>
            )}
          </div>

          <table className='tablenhap'>
            <thead className='theadnhap'>
              <tr>
                <td className='tdnhap'>
                  <input
                    type='checkbox'
                    onChange={e => {
                      if (e.target.checked) {
                        // Chọn tất cả sản phẩm
                        const allIds = selectedsanpham.map(ncc => ncc._id)
                        setCheckedItems(allIds)
                      } else {
                        // Bỏ chọn tất cả sản phẩm
                        setCheckedItems([])
                      }
                    }}
                    checked={
                      checkedItems.length === selectedsanpham.length &&
                      selectedsanpham.length > 0
                    }
                  />
                </td>
                <td className='tdnhap'>Mã sản phẩm</td>
                <td className='tdnhap'>Imel</td>
                {!isMobile && (
                  <>
                    <td className='tdnhap'>Tên máy</td>
                    <td className='tdnhap'>Trạng thái xuất kho</td>
                  </>
                )}
              </tr>
            </thead>
            <tbody className='tbodynhap'>
              {selectedsanpham.length > 0 ? (
                selectedsanpham.map(ncc => (
                  <tr key={ncc._id}>
                    <td>
                      <input
                        type='checkbox'
                        onChange={() => handleCheckboxChange(ncc._id)}
                        checked={checkedItems.includes(ncc._id)}
                      />
                    </td>
                    <td>{ncc.masp}</td>
                    <td>{ncc.imel}</td>
                    {!isMobile && (
                      <>
                        <td>{ncc.name}</td>
                        <td>{ncc.xuat ? 'đã xuất' : 'tồn kho'}</td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='7'>Không có sản phẩm nào!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default SanPhamGioHang
