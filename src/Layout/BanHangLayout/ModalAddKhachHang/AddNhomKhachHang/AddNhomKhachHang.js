import { useState } from 'react'
import { Modal } from '~/components/Modal'
import { useToast } from '~/components/GlobalStyles/ToastContext'
import { Loading } from '~/components/Loading' // Giả sử bạn có component Loading
import { getApiUrl } from '~/api/api'

function AddNhomKhachHang ({ isOpen, onClose, userId, fetchdata }) {
  const [name, setname] = useState('')
  const { showToast } = useToast()
  const [nameError, setnameError] = useState('')
  const [loading, setLoading] = useState(false)

  const validateInputs = () => {
    let valid = true

    if (!name) {
      setnameError('Vui lòng nhập tên nhóm khách hàng.')
      valid = false
    } else {
      setnameError('')
    }

    return valid
  }

  const handleAddNhomKhachHang = async () => {
    if (validateInputs()) {
      onClose()
      setLoading(true)
      try {
        const response = await fetch(
          `${getApiUrl('domain')}/postnhomkhachhang/${userId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: name
            })
          }
        )
        if (response.ok) {
          onClose()
          fetchdata()
          showToast('Thêm nhóm khách hàng thành công')
        } else {
          showToast('Thêm nhóm khách hàng thất bại', 'error')
          onClose()
        }
      } catch (error) {
        console.error('Lỗi khi gửi yêu cầu thêm nhóm khách hàng:', error)
        showToast('Thêm nhóm khách hàng thất bại', 'error')
        onClose()
      } finally {
        setLoading(false) // Kết thúc loading
      }
    }
  }

  return (
    <>
      {loading && (
        <div className='fullscreen-loading'>
          <Loading />
        </div>
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className='divaddkho'>
          <h2>Thêm kho hàng</h2>

          <div className='divtenkho'>
            <input
              type='text'
              className={`tenkho ${nameError ? 'input-error' : ''}`}
              placeholder=''
              onChange={e => setname(e.target.value)}
            />
            <label htmlFor='' className='label'>
              Nhập tên nhóm khách hàng
            </label>
          </div>
          {nameError && <div className='error'>{nameError}</div>}

          <hr />
          <button onClick={handleAddNhomKhachHang} className='btnaddkho'>
            Thêm nhóm khách hàng
          </button>
          <button onClick={() => onClose()} className='btnhuyaddkho'>
            Hủy
          </button>
        </div>
      </Modal>
    </>
  )
}

export default AddNhomKhachHang
