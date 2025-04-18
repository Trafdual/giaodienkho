/* eslint-disable react-hooks/exhaustive-deps */
// import { Modal } from '~/components/Modal'
import { useEffect, useState } from 'react'
import { getApiUrl } from '../../../../api/api'
import { CustomModal } from '../../../../components/CustomModal'
import { useToast } from '../../../../components/GlobalStyles/ToastContext'

function EditTheLoaiBlog ({ isOpen, onClose, fetchdata, idtheloai }) {
  const [name, setname] = useState('')
  const { showToast } = useToast()

  const handelClose = () => {
    setname('')
    onClose()
  }

  const fetchchitiet = async () => {
    try {
      const response = await fetch(
        `${getApiUrl('domain')}/admin/chitiettltrogiup/${idtheloai}`
      )
      const data = await response.json()
      if (response.ok) {
        setname(data.name)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (isOpen && idtheloai) {
      fetchchitiet()
    }
  }, [isOpen, idtheloai])

  const handelEditTheLoaiBlog = async () => {
    try {
      const response = await fetch(
        `${getApiUrl('domain')}/admin/updatetltrogiup/${idtheloai}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name
          })
        }
      )
      if (response.ok) {
        handelClose()
        showToast('Cập nhật thể loại thành công')
        fetchdata()
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <CustomModal isOpen={isOpen} onClose={handelClose}>
      <div className='addnhanvien'>
        <h2>Cập nhật thể loại blog</h2>
        <div className='div_input_group'>
          <div className='input-group'>
            <input
              type='text'
              value={name}
              onChange={e => setname(e.target.value)}
              placeholder='Nhập tên thể loại'
            />
          </div>
        </div>
        <div className='button-group'>
          <button onClick={handelEditTheLoaiBlog} className='btnaddtl'>
            Cập nhật
          </button>
        </div>
      </div>
    </CustomModal>
  )
}

export default EditTheLoaiBlog
