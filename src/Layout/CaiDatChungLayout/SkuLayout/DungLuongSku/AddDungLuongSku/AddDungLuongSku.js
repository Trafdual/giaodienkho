import { useState } from 'react'

import { Modal } from '~/components/Modal'
import { useToast } from '~/components/GlobalStyles/ToastContext'
import { ModalOnClose } from '~/components/ModalOnClose'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { getApiUrl } from '~/api/api'

function ModalAddDungLuongSku ({ isOpen, onClose, idsku, fetchsku }) {
  const [dungluong, setdungluong] = useState('')
  const [dungluongs, setdungluongs] = useState([])

  const { showToast } = useToast()
  const [dungluongError, setDungluongError] = useState('')

  const [isModalHuy, setIsModalHuy] = useState(false)
  const [isClickButton, setIsClickButton] = useState(false)

  const handleAddSku = async () => {
    setIsClickButton(true)
    try {
      const response = await fetch(
        `${getApiUrl('domain')}/postdungluongsku/${idsku}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            namedungluong: dungluongs
          })
        }
      )

      if (response.ok) {
        fetchsku()
        handelsave()
        setIsClickButton(false)
        setdungluongs([])
        showToast('Thêm sku thành công')
      } else {
        showToast('Thêm sku thất bại', 'error')
        onClose()
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu thêm sku:', error)
      showToast('Thêm sku thất bại', 'error')
    }
  }

  const handelsave = () => {
    onClose()
    setIsModalHuy(false)
  }

  const handleClose = () => {
    setIsModalHuy(true)
  }

  const handleKeyPress = event => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleAdddungluong()
    }
  }
  const handleRemovedungluong = index => {
    const newmangdungluong = [...dungluongs]
    newmangdungluong.splice(index, 1)
    setdungluongs(newmangdungluong)
  }

  const handleAdddungluong = () => {
    if (!dungluong) {
      setDungluongError('Vui lòng nhập dung lượng.')
      return
    }

    setdungluongs(prevMangdungluong => [...prevMangdungluong, dungluong])
    setdungluong('')
    setDungluongError('')
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className='divAddNhaCungCap'>
        <h2>Thêm Sku</h2>

        <div className='div_name_masku'>
          <label htmlFor=''>Nhập dung lượng</label>
          <div>
            <input
              type='number'
              className={`diachi ${dungluongError ? 'input-error' : ''}`}
              placeholder='VD: 64,128,....'
              value={dungluong}
              onChange={e => setdungluong(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
        </div>
        {dungluongError && <div className='error'>{dungluongError}</div>}
        {dungluongs.length > 0 && (
          <div className='mangmasp-list'>
            <h4>Danh sách dung lượng:</h4>
            <ul className='ulmangmasp'>
              {dungluongs.map((item, index) => (
                <li key={index} className='mangmasp-item'>
                  {item}
                  <button
                    className='remove-btn'
                    onClick={() => handleRemovedungluong(index)}
                  >
                    <FontAwesomeIcon className='remove-icon' icon={faXmark} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={handleAddSku}
          className={
            isClickButton
              ? 'btnAddNhaCungCap btnadddisabled'
              : 'btnAddNhaCungCap'
          }
          disabled={isClickButton}
        >
          {isClickButton ? '...Đang tải dữ liệu' : 'Thêm Sku'}
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

export default ModalAddDungLuongSku
