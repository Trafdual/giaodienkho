/* eslint-disable react-hooks/exhaustive-deps */
// import { Modal } from '~/components/Modal'
import { useEffect, useState } from 'react'
import { Birthday } from '~/components/Birthday'
import { getApiUrl } from '../../../../api/api'
import { useToast } from '../../../../components/GlobalStyles/ToastContext'
import { CustomModal } from '../../../../components/CustomModal'

function EditUser ({ isOpen, onClose, fetchdata, iduser }) {
  const [password, setpassword] = useState('')
  const [name, setname] = useState('')
  const [email, setemail] = useState('')

  const [phone, setphone] = useState('')
  const [ngaysinh, setngaysinh] = useState()

  const [role, setrole] = useState('')
  const { showToast } = useToast()

  const handelClose = () => {
    setrole('')
    setpassword('')
    setname('')
    setemail('')
    setphone('')
    setngaysinh('')
    onClose()
  }

  const fetchchitiet = async () => {
    try {
      const response = await fetch(
        `${getApiUrl('domain')}/getchitietuser/${iduser}`
      )
      if (response.ok) {
        const data = await response.json()
        setname(data.name)
        setemail(data.email)
        setphone(data.phone)
        setngaysinh(data.birthday)
        setrole(data.role)
      }
    } catch (error) {
      console.error(error)
    }
  }

  console.log(ngaysinh)

  useEffect(() => {
    if (isOpen && iduser) {
      fetchchitiet()
    }
  }, [isOpen, iduser])

  const handelEditUser = async () => {
    try {
      const response = await fetch(`${getApiUrl('domain')}/updateuser/${iduser}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          password,
          email,
          phone,
          birthday: ngaysinh,
          role
        })
      })
      if (response.ok) {
        handelClose()
        fetchdata()
        showToast('Cập nhật thành công')
      }
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <CustomModal isOpen={isOpen} onClose={handelClose}>
      <div className='addnhanvien'>
        <h2>Cập nhật người dùng</h2>
        <div className='div_input_group'>
          <div className='input-group'>
            <input
              type='text'
              value={name}
              onChange={e => setname(e.target.value)}
              placeholder='Nhập họ và tên'
            />

            <div className='divngaythangnam'>
              <label htmlFor=''>Ngày/tháng/năm sinh</label>
              <Birthday birthday={ngaysinh} setBirthday={setngaysinh} />
            </div>
            <input
              type='text'
              value={phone}
              onChange={e => setphone(e.target.value)}
              placeholder='Nhập số điện thoại'
            />
            <input
              type='text'
              value={email}
              onChange={e => setemail(e.target.value)}
              placeholder='Nhập email'
            />
          </div>

          <div className='input-group'>
            <input
              type='text'
              value={password}
              onChange={e => setpassword(e.target.value)}
              placeholder='Nhập password'
            />

            <div className='register_input_role'>
              <label for=''>Phân quyền</label>
              <div className='divgoitinh'>
                <input
                  type='radio'
                  onClick={() => setrole('manager')}
                  checked={role === 'manager'}
                />

                <label htmlFor=''>Manager</label>
              </div>
              <div className='divgoitinh'>
                <input
                  type='radio'
                  onClick={() => setrole('admin')}
                  checked={role === 'admin'}
                />

                <label htmlFor=''>Admin</label>
              </div>
            </div>
          </div>
        </div>

        <div className='button-group'>
          <button onClick={handelEditUser} className='btnaddtl'>
            Cập nhật
          </button>
        </div>
      </div>
    </CustomModal>
  )
}

export default EditUser
