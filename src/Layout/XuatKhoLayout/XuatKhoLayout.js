/* eslint-disable react-hooks/exhaustive-deps */
import './XuatKhoLayout.scss'
import { useState, useEffect } from 'react'
import { useToast } from '../../components/GlobalStyles/ToastContext'
import { Loading } from '~/components/Loading'

function XuatKhoLayout () {
  const { showToast } = useToast()
  const [lohang, setlohang] = useState([])
  const [khoID, setKhoID] = useState(localStorage.getItem('khoID') || '')
  const [selectAll, setSelectAll] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])
  const [loading, setLoading] = useState(true)

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

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(9)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setItemsPerPage(9)
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

  const fetchData = async () => {
    if (!khoID) return

    try {
      const response = await fetch(
        `https://www.ansuataohanoi.com/getxuatkho/${khoID}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        setlohang(data)
        setLoading(false)
      } else {
        console.error('Failed to fetch data')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [khoID])

  // Tính toán mục để hiển thị cho trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = lohang.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(lohang.length / itemsPerPage)

  // Chuyển trang
  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber)
  }

  const XoaHangLoat = async () => {
    try {
      const response = await fetch(
        `https://www.ansuataohanoi.com/deletexuatkho/${khoID}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            idsp: selectedItems
          })
        }
      )

      if (response.ok) {
        showToast(`Xóa thành công`)
        fetchData()
        setSelectedItems([])
        setSelectAll(false)
      } else {
        console.error('Failed to fetch data')
        showToast('xóa thất bại', 'error')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          ;
          <div className='detailsnhap'>
            <div className='recentOrdersnhap'>
              <div className='headernhap'>
                <h2 className='divncc'>Sản phẩm xuất kho</h2>
              </div>
              {selectedItems.length > 0 && (
                <div className='action-menu'>
                  <h4>{selectedItems.length} sản phẩm được chọn</h4>
                  <button className='btn-xoa' onClick={XoaHangLoat}>
                    Xóa Tất Cả
                  </button>
                </div>
              )}
              <div className='divtablexuakho'>
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

                      <td className='tdnhap'>Mã Lô Hàng</td>
                      <td className='tdnhap'>Mã Sản Phẩm</td>
                      <td className='tdnhap'>Imel</td>
                      <td className='tdnhap'>Tên Sản Phẩm</td>
                      <td className='tdnhap'>Ngày nhập</td>
                      <td className='tdnhap'>Ngày Xuất</td>
                    </tr>
                  </thead>
                  <tbody className='tbodynhap'>
                    {currentItems.length > 0 ? (
                      currentItems.map(ncc => (
                        <tr key={ncc._id}>
                          <td>
                            <input
                              type='checkbox'
                              checked={selectedItems.includes(ncc._id)}
                              onChange={() => handleSelectItem(ncc._id)}
                            />
                          </td>

                          <td>{ncc.malohang}</td>
                          <td>{ncc.masp}</td>
                          <td>{ncc.imel}</td>
                          <td>{ncc.tenmay}</td>
                          <td>{ncc.ngaynhap}</td>
                          <td>{ncc.ngayxuat}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan='7'>Không có sản phẩm nào</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

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
          </div>
        </>
      )}
    </>
  )
}

export default XuatKhoLayout
