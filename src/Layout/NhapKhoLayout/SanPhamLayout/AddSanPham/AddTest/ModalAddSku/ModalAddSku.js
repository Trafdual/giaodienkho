import { useState, useCallback } from 'react'

import { Modal } from '~/components/Modal'
import { useToast } from '~/components/GlobalStyles/ToastContext'
import { ModalOnClose } from '~/components/ModalOnClose'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import './ModalAddSku.scss'
function ModalAddSku ({ isOpen, onClose, userID, fetchsku }) {
  const [name, setName] = useState('')
  const [dungluong, setdungluong] = useState('')
  const [dungluongs, setdungluongs] = useState([])

  const { showToast } = useToast()
  const [nameError, setNameError] = useState('')
  const [dungluongError, setDungluongError] = useState('')

  const [isModalHuy, setIsModalHuy] = useState(false)
  const [isClickButton, setIsClickButton] = useState(false)

  const validateInputs = () => {
    let valid = true

    if (!name) {
      setNameError('Vui lòng nhập tên nhà cung cấp.')
      valid = false
      setIsModalHuy(false)
    } else {
      setNameError('')
    }

    return valid
  }

  const handleAddSku = async () => {
    if (validateInputs()) {
      setIsClickButton(true)
      try {
        const response = await fetch(`https://baotech.shop/postsku/${userID}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: name,
            namedungluong: dungluongs
          })
        })

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
  }

  const resetForm = useCallback(() => {
    setName('')
    setNameError('')
  }, [])

  const handelsave = () => {
    resetForm()
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
          <label htmlFor=''>Nhập tên sản phẩm</label>
          <div>
            <input
              type='text'
              className={`tenkho ${nameError ? 'input-error' : ''}`}
              placeholder='VD: 12 pro max'
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
        </div>

        {nameError && <div className='error'>{nameError}</div>}
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

export default ModalAddSku
