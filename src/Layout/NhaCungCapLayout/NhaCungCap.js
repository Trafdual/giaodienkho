/* eslint-disable react-hooks/exhaustive-deps */
import './NhaCungCap.scss'
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { LoHangLayout } from './LoHangLayout'
import '../ColumnResizer/columnResizer.scss'
import { enableColumnResizing } from '../ColumnResizer/columnResizer';


import { AddNhaCungCap } from './AddNhaCungCap'
function NhaCungCapLayout () {
  const [nhacungcap, setnhacungcap] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [opendetail, setopendetail] = useState(true)
  const [idncc, setidncc] = useState('')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  const [khoID, setKhoID] = useState(localStorage.getItem('khoID') || '')
  const handleCloseModal = () => {
    setIsOpen(false)
  }
  const handleLohang = id => {
    setidncc(id)
    setopendetail(false)
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
  }, [localStorage.getItem('khoID')])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsMobile(window.innerWidth <= 768)
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

  useEffect(() => {
    console.log(localStorage.getItem('khoID'))
    let isMounted = true

    const fetchData = async () => {
      if (!khoID) return

      try {
        const response = await fetch(
          `https://www.ansuataohanoi.com/getnhacungcap/${khoID}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )

        if (response.ok && isMounted) {
          const data = await response.json()
          setnhacungcap(data)
        } else {
          console.error('Failed to fetch data')
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching data:', error)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [khoID])
  useEffect(() => {
    enableColumnResizing('.tablenhap'); 
  }, []);
  return (
    <>
      {opendetail && (
        <div className='detailsnhap'>
          <div className='recentOrdersnhap'>
            <div className='headernhap'>
              <h2 className='divncc'>Nhà cung cấp</h2>
              <button className='btnthemlo' onClick={() => setIsOpen(true)}>
                <FontAwesomeIcon className='iconncc' icon={faPlus} />
                <h3>Thêm nhà cung cấp</h3>
              </button>
            </div>
            <table className='tablenhap'>
              <thead className='theadnhap'>
                <tr>
                  <td className='tdnhap'>Mã nhà cung cấp</td>
                  <td className='tdnhap'>Tên nhà cung cấp</td>
                  {!isMobile && (
                    <>
                      <td className='tdnhap'>Số điện thoại</td>
                      <td className='tdnhap'>Địa chỉ</td>
                    </>
                  )}
                  <td className='tdnhap'>Chức năng</td>
                </tr>
              </thead>
              <tbody className='tbodynhap'>
                {nhacungcap.length > 0 ? (
                  nhacungcap.map(ncc => (
                    <tr key={ncc._id}>
                      <td>{ncc.mancc}</td>
                      <td>{ncc.name}</td>
                      {!isMobile && (
                        <>
                          <td>{ncc.phone}</td>
                          <td>{ncc.address}</td>
                        </>
                      )}
                      <td className='tdchucnang'>
                        <button
                          className='btnchitietncc'
                          onClick={() => handleLohang(ncc._id)}
                        >
                          <h3>Chi tiết</h3>
                        </button>
                        <button
                          className='btncnncc'
                          onClick={() => setIsOpen(true)}
                        >
                          <h3>Cập nhật</h3>
                        </button>
                      </td>
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
          <AddNhaCungCap
            isOpen={isOpen}
            onClose={handleCloseModal}
            khoID={khoID}
            setnhacungcap={setnhacungcap}
          />
        </div>
      )}
      <LoHangLayout
        opendetail={opendetail}
        setopendetail={setopendetail}
        idncc={idncc}
      />
    </>
  )
  
}


export default NhaCungCapLayout
