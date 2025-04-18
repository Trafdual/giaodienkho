/* eslint-disable react-hooks/exhaustive-deps */
import { Modal } from '../../../../../components/Modal'
import { useEffect, useState } from 'react'
import ReactQuill from 'react-quill'
import { useToast } from '~/components/GlobalStyles/ToastContext'
import 'react-quill/dist/quill.snow.css'
import { getApiUrl } from '../../../../../api/api'

function EditBlog ({ isOpen, onClose, fetchdata, idblog }) {
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

  const fetchchitiet = async () => {
    try {
      const response = await fetch(
        `${getApiUrl('domain')}/gettrogiup/${idblog}`
      )
      const data = await response.json()
      if (response.ok) {
        settieude_blog(data.tieude)
        setnoidung(data.noidung)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (isOpen && idblog) {
      fetchchitiet()
    }
  }, [isOpen, idblog])
  
  const handelAddBlog = async () => {
    try {
      const formData = new FormData()
      formData.append('tieude', tieude_blog)
      formData.append('noidung', noidung)

      if (file) {
        formData.append('image', file)
      }

      const response = await fetch(`${getApiUrl('domain')}/posttrogiup`, {
        method: 'POST',
        body: formData
      })
      if (response.ok) {
        handelclose()
        fetchdata()
        showToast('Cập nhật Blog thành công!')
      }
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <Modal isOpen={isOpen} onClose={handelclose}>
      <div className='addtheloai'>
        <h2 className='title_addblog'>Cập nhật Blog</h2>
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
            Cập nhật
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default EditBlog
