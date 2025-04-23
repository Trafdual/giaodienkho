/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { getApiUrl } from '../../../api/api'
import { ModalThuNo } from '../ModalThuNo'
import { PaginationComponent } from '../../../components/NextPage'
function ThuNoKhachHang ({ khoID, userId }) {
  const [data, setdata] = useState([])
  const [hoadons, sethoadons] = useState([])
  const [isOpenThuNo, setIsOpenThuNo] = useState(false)
  const [khachhangid, setkhachhangid] = useState('')
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [currentPage, setCurrentPage] = useState(1)

  const fetchhoadon = async () => {
    try {
      const response = await fetch(`${getApiUrl('domain')}/gettrano/${khoID}`)
      if (response.ok) {
        const data = await response.json()
        setdata(data)
      }
    } catch (error) {
      console.error('Error fetching:', error)
    }
  }

  useEffect(() => {
    if (khoID) {
      fetchhoadon()
    }
  }, [khoID])

  const totalPages = Math.ceil(data.length / itemsPerPage)
  const totalResults = data.length
  const handlePageChange = page => {
    setCurrentPage(page)
  }

  return (
    <>
      <div className='tab-content-container'>
        <div className='divtablethuno'>
          <table className='thu-no-table'>
            <thead>
              <tr className='trthuno'>
                <th className='text-left'>Tên Khách Hàng</th>
                <th>Địa Chỉ</th>
                <th>Số Điện Thoại</th>
                <th className='text-right'>Tổng Dư Nợ</th>
                <th className='text-right'>
                  <i className='isetting'></i>
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td className='text-left'>{item.namekhachhang}</td>
                  <td>{item.address}</td>
                  <td>{item.phone}</td>
                  <td className='text-right'>
                    {item.tongtien.toLocaleString()}
                  </td>
                  <td>
                    <button
                      className='thu-no-button'
                      onClick={() => {
                        sethoadons(item.ids)
                        setIsOpenThuNo(true) //
                        setkhachhangid(item.khachhangid)
                      }}
                    >
                      Thu nợ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <ModalThuNo
            isOpen={isOpenThuNo}
            onClose={() => setIsOpenThuNo(false)}
            userId={userId}
            hoadons={hoadons}
            khoID={khoID}
            fetchhoadon={fetchhoadon}
            khachhangid={khachhangid}
          />
        </div>
      </div>
      <div className='pagination1'>
        <PaginationComponent
          totalPages={totalPages}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          totalResults={totalResults}
          fetchData={fetchhoadon}
        />
      </div>
    </>
  )
}

export default ThuNoKhachHang
