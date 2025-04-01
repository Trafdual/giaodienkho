import { Modal } from '~/components/Modal'
import { useState } from 'react'
import './AddUser.scss'
import { Birthday } from '~/components/Birthday'

function AddUser ({ isOpen, onClose, fetchdata }) {
  const [password, setpassword] = useState('')
  const [name, setname] = useState('')
  const [email, setemail] = useState('')

  const [phone, setphone] = useState('')
  const [ngaysinh, setngaysinh] = useState()

  const [role, setrole] = useState('manager')

  const handelClose = () => {
    setrole('manager')
    setpassword('')
    setname('')
    setemail('')
    setphone('')
    setngaysinh('')
    onClose()
  }

  const handelAddUser = async () => {
    try {
      const response = await fetch('https://baotech.shop/registeradmin', {
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
      }
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <Modal isOpen={isOpen} onClose={handelClose}>
      <div className='addnhanvien'>
        <h2>Thêm người dùng</h2>
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
              <Birthday setBirthday={setngaysinh} />
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
          <button onClick={handelAddUser} className='btnaddtl'>
            Thêm
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default AddUser
