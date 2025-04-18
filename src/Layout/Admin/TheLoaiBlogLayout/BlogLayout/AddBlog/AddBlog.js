import { Modal } from '../../../../../components/Modal'
import { useState } from 'react'
import ReactQuill from 'react-quill'
import { useToast } from '~/components/GlobalStyles/ToastContext'
import 'react-quill/dist/quill.snow.css'
import './AddBlog.scss'
import { getApiUrl } from '../../../../../api/api'

function AddBlog ({ isOpen, onClose, fetchdata, idtheloai }) {
  const [tieude_blog, settieude_blog] = useState('')
  const [file, setFile] = useState(null)
  const [noidung, setnoidung] = useState('')
  const { showToast } = useToast()
  const handelclose = () => {
    settieude_blog('')
    setnoidung('')
    setFile(null)
    onClose()
  }

  const handelAddBlog = async () => {
    try {
      const formData = new FormData()
      formData.append('tieude', tieude_blog)
      formData.append('noidung', noidung)

      if (file) {
        formData.append('image', file)
      }

      const response = await fetch(
        `${getApiUrl('domain')}/posttrogiup/${idtheloai}`,
        {
          method: 'POST',
          body: formData
        }
      )
      if (response.ok) {
        handelclose()
        fetchdata()
        showToast('Thêm Blog thành công!')
      }
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <Modal isOpen={isOpen} onClose={handelclose}>
      <div className='addtheloai'>
        <h2 className='title_addblog'>Thêm Blog</h2>
        <div className='input-group'>
          <label> Ảnh</label>
          <input type='file' onChange={e => setFile(e.target.files[0])} />

          <label>Tiêu đề:</label>
          <input
            type='text'
            value={tieude_blog}
            onChange={e => settieude_blog(e.target.value)}
            placeholder='Nhập tiêu đề'
          />
          <label>Nội dung:</label>
          <ReactQuill
            value={noidung}
            onChange={setnoidung}
            placeholder='Nhập nội dung'
            theme='snow'
          />
        </div>

        <div className='button-group'>
          <button onClick={handelAddBlog} className='btnaddtl'>
            Thêm
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default AddBlog
