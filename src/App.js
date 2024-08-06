/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import './App.scss'
import images from './assets/images'
import { Image as ImageLogin } from './components/ImageLogin'

function App () {
  const [showPassword, setShowPassword] = useState(false)
  const [isIconVisible, setIsIconVisible] = useState(false)
  const containerRef = useRef()
 
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }
  return (
    <div className='container'>
      <div className='dualscreen1'>
        <ImageLogin />
      </div>
      <div className='dualscreen2'>
        <div className='divlogin'>
          <h1>Đăng Nhập</h1>
          <div className='divemail'>
            <input className='email' placeholder='' />
            <label className='label'>Email</label>
          </div>
          <div className='divpassword'>
            <div className='divippass'>
              <input
                className='password'
                type={showPassword ? 'text' : 'password'}
                placeholder=''
                onFocus={() => setIsIconVisible(true)}
                ref={containerRef}
              />
              <label className='label'>Password</label>
              {isIconVisible && (
                <button className='eye' onClick={togglePasswordVisibility}>
                  <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                </button>
              )}
            </div>
          </div>
          <button className='btnLogin'>Đăng Nhập</button>
          <div className='divcachkhac'>
            <button className='btnfacebook'>
              <img src={images.facebook} alt='' className='facebook' />
            </button>
            <button className='btngoogle'>
              <img src={images.google} alt='' className='google' />
            </button>
          </div>
          <div className='divRegister'>
            <h3 className = 'register1'>Bạn chưa có tài khoản?</h3>
            <h3 className='register'>Đăng ký</h3>
          </div>
          <div className='chinhsach'>
            <h4 >
              TRANG WEB NÀY ĐƯỢC BẢO MẬT BỞI HCAPTCHA VÀ TUÂN THỦ THEO{' '}
              <a href='https://www.hcaptcha.com/privacy'>
                CHÍNH SÁCH QUYỀN RIÊNG TƯ
              </a>{' '}
              VÀ{' '}
              <a href='https://www.hcaptcha.com/terms'>
                ĐIỀU KHOẢN DỊCH VỤ CỦA HCAPTCHA
              </a>{' '}
              .
            </h4>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
