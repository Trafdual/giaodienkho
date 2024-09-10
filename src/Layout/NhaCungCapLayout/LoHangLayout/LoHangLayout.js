import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLeftLong, faPlus } from '@fortawesome/free-solid-svg-icons'

import { AddLoHang } from './AddLoHang'
function LoHangLayout ({ opendetail, setopendetail, idncc }) {
  const [isOpen, setIsOpen] = useState(false)

  const [lohang, setlohang] = useState([])

  const handleCloseModal = () => {
    setIsOpen(false)
  }

  useEffect(() => {
    console.log(idncc)
    let isMounted = true

    const fetchData = async () => {
      if (!idncc) return

      try {
        const response = await fetch(
          `https://www.ansuataohanoi.com/getloaisanpham/${idncc}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )

        if (response.ok && isMounted) {
          const data = await response.json()
          setlohang(data)
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
  }, [idncc])

  return (
    <>
      {!opendetail && (
        <div className='detailsnhap'>
          <div className='recentOrdersnhap'>
            <div className='headernhap'>
              <div className='divncc'>
                <FontAwesomeIcon
                  className='iconout'
                  icon={faLeftLong}
                  onClick={() => setopendetail(true)}
                />
                <h2 className='h2ncc'>Lô hàng</h2>
              </div>
              <button className='btnthemlo' onClick={() => setIsOpen(true)}>
                <FontAwesomeIcon className='iconncc' icon={faPlus} />
                <h3>Thêm Lô Hàng</h3>
              </button>
            </div>
            <table className='tablenhap'>
              <thead className='theadnhap'>
                <tr>
                  <td className='tdnhap'>Mã lô hàng</td>
                  <td className='tdnhap'>Tên lô hàng</td>
                  <td className='tdnhap'>Số lượng máy</td>
                  <td className='tdnhap'>Ngày nhập</td>
                  <td className='tdnhap'>Tổng tiền</td>
                  <td className='tdnhap'>Trung bình máy</td>
                  <td className='tdnhap'>Chức năng</td>
                </tr>
              </thead>
              <tbody className='tbodynhap'>
                {lohang.length > 0 ? (
                  lohang.map(ncc => (
                    <tr key={ncc._id}>
                      <td>{ncc.malsp}</td>
                      <td>{ncc.name}</td>
                      <td>{ncc.soluong}</td>
                      <td>{ncc.date}</td>
                      <td>{ncc.tongtien}</td>
                      <td>{ncc.average}</td>

                      <td className='tdchucnang'>
                        <button className='btnchitietncc'>
                          <h3>Chi tiết</h3>
                        </button>
                        <button className='btncnncc'>
                          <h3>Cập nhật thông tin</h3>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan='7'>Không có lô hàng nào</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <AddLoHang
            isOpen={isOpen}
            onClose={handleCloseModal}
            nccId={idncc}
            setlohang={setlohang}
          />
        </div>
      )}
    </>
  )
}

export default LoHangLayout
