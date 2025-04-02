/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react'

import { Modal } from '../../../components/Modal'
import { ChuyenKho } from './ChuyenKho'
import { useToast } from '../../../components/GlobalStyles/ToastContext'
import { getApiUrl } from '../../../api/api'

function ModalXuatKho ({
  isOpen,
  onClose,
  setsanpham,
  idsanpham,
  idloaisp,
  khoID,
  fetchData
}) {
  const [isOpenForm, setIsOpenForm] = useState(false)
  const { showToast } = useToast()

  const OpenFormChuyenKho = () => {
    setIsOpenForm(true)
    onClose()
  }
  const postxuatkho = async idsp => {
    if (!idloaisp) return

    try {
      const response = await fetch(
        `${getApiUrl('domain')}/xuatkho/${idsp}/${idloaisp}/${khoID}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.ok) {
        showToast('xuất kho thành công')
        fetchData()
        onClose()
      } else {
        console.error('Failed to fetch data')
        showToast('Xuất kho thất bại')
        onClose()
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className='divAddSanPham'>
          <button
            onClick={() => postxuatkho(idsanpham)}
            className='btnAddNhaCungCap'
          >
            Xuất kho
          </button>
          <div className='separator'>
            <span>Hoặc</span>
          </div>
          <button onClick={OpenFormChuyenKho} className='btnhuyAddNhaCungCap'>
            Chuyển kho
          </button>
        </div>
      </Modal>
      <ChuyenKho
        isOpen={isOpenForm}
        onClose={() => setIsOpenForm(false)}
        idsanpham={idsanpham}
        fetchData={fetchData}
      />
    </>
  )
}

export default ModalXuatKho
