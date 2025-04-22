// import { Modal } from '~/components/Modal'
import { useState } from 'react'
import { getApiUrl } from '../../../../api/api'
import { CustomModal } from '../../../../components/CustomModal'
import { useToast } from '../../../../components/GlobalStyles/ToastContext'

function AddTheLoaiBlog ({ isOpen, onClose, fetchdata }) {
  const [name, setname] = useState('')
  const { showToast } = useToast()

  const handelClose = () => {
    setname('')
    onClose()
  }

  const handelAddTheLoaiBlog = async () => {
    try {
      const response = await fetch(
        `${getApiUrl('domain')}/admin/posttheloaitrogiup`,
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
        showToast('Thêm thể loại thành công')
        fetchdata()
      }
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <CustomModal isOpen={isOpen} onClose={handelClose}>
      <div className='addnhanvien'>
        <h2>Thêm thể loại blog</h2>
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
          <button onClick={handelAddTheLoaiBlog} className='btnaddtl'>
            Thêm
          </button>
        </div>
      </div>
    </CustomModal>
  )
}

export default AddTheLoaiBlog
