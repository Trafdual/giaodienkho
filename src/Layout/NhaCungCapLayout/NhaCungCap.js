/* eslint-disable react-hooks/exhaustive-deps */
import './NhaCungCap.scss'
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEye,
  faPen,
  faPlus,
  faTrashCan
} from '@fortawesome/free-solid-svg-icons'
import '../ColumnResizer/columnResizer.scss'
import { enableColumnResizing } from '../ColumnResizer/columnResizer'
import { Loading } from '~/components/Loading'

import { AddNhaCungCap } from './AddNhaCungCap'
import { EditNhaCungCap } from './EditNhaCungCap'
import { PaginationComponent } from '~/components/NextPage'
import { getFromLocalStorage } from '~/components/MaHoaLocalStorage/MaHoaLocalStorage'
function NhaCungCapLayout () {
  const [nhacungcap, setnhacungcap] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenEdit, setIsOpenEdit] = useState(false)
  const [idncc, setidncc] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedItems, setSelectedItems] = useState([])

  const [khoID, setKhoID] = useState(localStorage.getItem('khoID') || '')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(9)
  const [selectAll, setSelectAll] = useState(false)
  const userdata = getFromLocalStorage('data')

  const handleCloseModal = () => {
    setIsOpen(false)
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
  }, [localStorage.getItem('khoID')])

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://ansuataohanoi.com/getnhacungcap/${khoID}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        setnhacungcap(data)
        setLoading(false)
      } else {
        console.error('Failed to fetch data')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    console.log(localStorage.getItem('khoID'))
    if (khoID) {
      fetchData()
    }
  }, [khoID])

  useEffect(() => {
    enableColumnResizing('.tablenhap')
  }, [])

  const totalPages = Math.ceil(nhacungcap.length / itemsPerPage)
  const totalResults = nhacungcap.length

  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber)
  }

  const handleSelectAll = () => {
    const newSelectAll = !selectAll
    setSelectAll(newSelectAll)

    if (newSelectAll) {
      const allIds = nhacungcap.map(item => item._id)
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
    setSelectAll(updatedSelectedItems.length === nhacungcap.length)
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className='divnhacungcap'>
          <div className='detailsnhap'>
            <div className='recentOrdersnhap'>
              <div
                className='action-menu'
                style={{ position: 'sticky', top: '0px' }}
              >
                <h4>{selectedItems.length} nhà cung cấp được chọn</h4>
                <button className={`btn-xoa `} onClick={() => setIsOpen(true)}>
                  <FontAwesomeIcon icon={faPlus} className='iconMenuSanPham' />
                  Thêm nhà cung cấp
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
                  onClick={() => setIsOpenEdit(true)}
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
              <div className='table-container'>
                <table className='tablenhap'>
                  <thead className='theadnhap'>
                    <tr>
                      <td>
                        <input
                          type='checkbox'
                          checked={selectAll}
                          onChange={handleSelectAll}
                        />
                      </td>
                      <td className='tdnhap'>Mã nhà cung cấp</td>
                      <td className='tdnhap'>Tên nhà cung cấp</td>
                      <td className='tdnhap'>Số điện thoại</td>
                      <td className='tdnhap'>Địa chỉ</td>
                    </tr>
                  </thead>
                  <tbody className='tbodynhap'>
                    {nhacungcap.length > 0 ? (
                      nhacungcap.map(ncc => (
                        <tr key={ncc._id}>
                          <td>
                            <input
                              type='checkbox'
                              checked={selectedItems.includes(ncc._id)}
                              onChange={() => {
                                handleSelectItem(ncc._id)
                                setidncc(ncc._id)
                              }}
                            />
                          </td>
                          <td>{ncc.mancc}</td>
                          <td>{ncc.name}</td>
                          <td>{ncc.phone}</td>
                          <td>{ncc.address}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan='5'>Không có nhà cung cấp nào</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <AddNhaCungCap
              isOpen={isOpen}
              onClose={handleCloseModal}
              khoID={khoID}
              setnhacungcap={setnhacungcap}
            />
            <EditNhaCungCap
              isOpen={isOpenEdit}
              onClose={() => setIsOpenEdit(false)}
              idncc={idncc}
              fetchdata={fetchData}
              setidncc={setidncc}
            />
          </div>
          <div className='pagination1'>
            <PaginationComponent
              totalPages={totalPages}
              currentPage={currentPage}
              handlePageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              totalResults={totalResults}
              fetchData={fetchData}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default NhaCungCapLayout
