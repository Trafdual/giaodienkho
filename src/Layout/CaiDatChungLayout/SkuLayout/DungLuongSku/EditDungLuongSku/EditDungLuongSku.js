/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'

import { Modal } from '~/components/Modal'
import { useToast } from '~/components/GlobalStyles/ToastContext'
import { ModalOnClose } from '~/components/ModalOnClose'
import { getApiUrl } from '~/api/api'

function EditDungLuongSku ({ isOpen, onClose, fetchsku, iddungluong }) {
  const [dungluong, setdungluong] = useState('')

  const { showToast } = useToast()
  const [isModalHuy, setIsModalHuy] = useState(false)
  const [isClickButton, setIsClickButton] = useState(false)

  const fetchchitiet = async () => {
    try {
      const response = await fetch(
        `${getApiUrl('domain')}/getchitietdl/${iddungluong}`
      )
      const data = await response.json()
      if (response.ok) {
        setdungluong(data.name)
      }
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết dung lượng:', error)
      showToast('lấy chi tiết dung lượng thất bại', 'error')
    }
  }

  useEffect(() => {
    if (isOpen && iddungluong) {
      fetchchitiet()
    }
  }, [isOpen, iddungluong])

  const handleAddSku = async () => {
    setIsClickButton(true)

    try {
      const response = await fetch(
        `${getApiUrl('domain')}/editdungluongsku/${iddungluong}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            namedungluong: dungluong
          })
        }
      )

      if (response.ok) {
        fetchsku()
        handelsave()
        setIsClickButton(false)
        showToast('Cập nhật sku thành công')
      } else {
        showToast('Cập nhật sku thất bại', 'error')
        onClose()
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu Cập nhật sku:', error)
      showToast('Cập nhật sku thất bại', 'error')
    }
  }

  const handelsave = () => {
    onClose()
    setIsModalHuy(false)
  }

  const handleClose = () => {
    setIsModalHuy(true)
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className='divAddNhaCungCap'>
        <h2>Cập nhật Sku</h2>

        <div className='div_name_masku'>
          <label htmlFor=''>Nhập dung lượng</label>
          <div>
            <input
              type='number'
              className={`diachi`}
              placeholder='VD: 64,128,....'
              value={dungluong}
              onChange={e => setdungluong(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={handleAddSku}
          className={
            isClickButton
              ? 'btnAddNhaCungCap btnadddisabled'
              : 'btnAddNhaCungCap'
          }
          disabled={isClickButton}
        >
          {isClickButton ? '...Đang tải dữ liệu' : 'Cập nhật Sku'}
        </button>
      </div>
      <ModalOnClose
        isOpen={isModalHuy}
        Save={handleAddSku}
        DontSave={handelsave}
        Cancel={() => setIsModalHuy(false)}
      />
    </Modal>
  )
}

export default EditDungLuongSku
