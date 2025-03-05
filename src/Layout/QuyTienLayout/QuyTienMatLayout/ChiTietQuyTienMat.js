/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'

function ChiTietQuyTienMat ({
  idquytien,
  remainingHeight,
  loading,
  setLoading
}) {
  const [chitiet, setchitiet] = useState([])

  const Loading = () => {
    return (
      <div
        className='loading-container'
        style={{ height: `${remainingHeight}px`, width: '100%' }}
      >
        <div className='spinner'></div>
        <h3 className='h3loading'>Đang lấy dữ liệu...</h3>
      </div>
    )
  }

  const fetchData = async () => {
    if (!idquytien) return

    try {
      const response = await fetch(
        `https://baotech.shop/getchitietthuchi/${idquytien}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      if (response.ok) {
        const data = await response.json()
        setchitiet(data)
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
  }, [idquytien])

  // useEffect(() => {
  //   const eventSource = new EventSource('https://baotech.shop/events')

  //   eventSource.onmessage = event => {
  //     const newMessage = JSON.parse(event.data)
  //     showToast(newMessage.message)
  //     fetchData()
  //   }

  //   return () => {
  //     eventSource.close()
  //   }
  // }, [])

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
                  <h2 className='h2ncc'>Chi tiết</h2>
                </div>
              </div>

              <div className='divtablespnhapkho'>
                <table className='tablenhap'>
                  <thead className='theadnhap'>
                    <tr>
                      <td className='tdnhap'>Diễn giải</td>
                      <td className='tdnhap'>Số tiền</td>
                      <td className='tdnhap'>Mục thu/chi</td>
                    </tr>
                  </thead>
                  <tbody className='tbodynhap'>
                    {chitiet.length > 0 ? (
                      chitiet.map(ncc => (
                        <>
                          <tr key={ncc._id}>
                            <td>{ncc.diengiai}</td>
                            <td>{ncc.sotien.toLocaleString()} VNĐ</td>
                            <td>{ncc.mucthuchi}</td>
                          </tr>
                        </>
                      ))
                    ) : (
                      <tr>
                        <td colSpan='8'>Không có chi tiết nào</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default ChiTietQuyTienMat
