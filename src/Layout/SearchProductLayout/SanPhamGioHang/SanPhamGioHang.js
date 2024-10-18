import React, { useState } from 'react'

function SanPhamGioHang ({ remainingHeight, selectedsanpham }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

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
          </div>

          <table className='tablenhap'>
            <thead className='theadnhap'>
              <tr>
                <td className='tdnhap'>
                  <input type='checkbox' />
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
              </tr>
            </thead>
            <tbody className='tbodynhap'>
              {selectedsanpham.length > 0 ? (
                selectedsanpham.map(ncc => (
                  <>
                    <tr key={ncc._id}>
                      <td>
                        <input
                          type='checkbox'
                          checked={selectedsanpham.includes(ncc._id)}
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
                    </tr>
                  </>
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
