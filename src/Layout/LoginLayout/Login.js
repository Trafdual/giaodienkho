import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.scss'
import images from '../../assets/images'
import { Image as ImageLogin } from '../../components/ImageLogin'
import { publicRoutes } from '../../router'
import { LogoSwitcher as LogoSwitcherLogin } from '../../components/SwitchImageLogin'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { useToast } from '../../components/GlobalStyles/ToastContext'
import { saveToLocalStorage } from '~/components/MaHoaLocalStorage/MaHoaLocalStorage'
function Login () {
  const [showPassword, setShowPassword] = useState(false)
  const [isIconVisible, setIsIconVisible] = useState(false)
  const [emailOrPhone, setemailOrPhone] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const navigate = useNavigate()
  const { showToast } = useToast()
  useEffect(() => {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token')
    if (token) {
      navigate(publicRoutes[1].path)
    }
  }, [navigate])

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleRememberMeChange = e => {
    setRememberMe(e.target.checked)
  }

  const validateInputs = () => {
    let valid = true

    if (!emailOrPhone) {
      setEmailError('Vui lòng nhập email hoặc số điện thoại')
      valid = false
    } else {
      setEmailError('')
    }

    if (!password) {
      setPasswordError('Vui lòng nhập mật khẩu.')
      valid = false
    } else {
      setPasswordError('')
    }

    return valid
  }

  const handleLogin = async () => {
    if (validateInputs()) {
      setIsLoading(true)
      try {
        const response = await fetch('https://baotech.shop/loginadmin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            emailOrPhone: emailOrPhone,
            password: password
          })
        })

        const data = await response.json()
        console.log(data)

        if (data.data) {
          if (data.data.user[0].role === 'admin') {
            saveToLocalStorage('data', data)
            navigate('/admin?tab=Users')
          } else {
            const userId = data.data.user[0]._id
            const name = data.data.user[0].name
            if (rememberMe) {
              localStorage.setItem('token', data.token)
              saveToLocalStorage('userId', userId)
              saveToLocalStorage('name', name)
              saveToLocalStorage('data', data)
            } else {
              sessionStorage.setItem('token', data.token)
              saveToLocalStorage('userId', userId)
              saveToLocalStorage('name', name)
              saveToLocalStorage('data', data)
            }
            showToast('Đăng nhập thành công!')
            navigate(publicRoutes[1].path, { state: { userId: userId } })
          }
        } else {
          showToast(data.message, 'error')
        }
      } catch (error) {
        console.log(
          `Đã xảy ra lỗi khi gửi yêu cầu đăng nhập. Vui lòng thử lại. ${error}`
        )
      } finally {
        setIsLoading(false)
      }
    }
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
            <div className='divemail1'>
              <input
                className={`email ${emailError ? 'input-error' : ''}`}
                placeholder=' '
                value={emailOrPhone}
                onChange={e => setemailOrPhone(e.target.value)}
              />
              <label className='label'>Email/Số điện thoại</label>
            </div>
            {emailError && <div className='error'>{emailError}</div>}
          </div>
          <div className='divpassword'>
            <div className='divippass'>
              <input
                className={`password ${passwordError ? 'input-error' : ''}`}
                type={showPassword ? 'text' : 'password'}
                placeholder=' '
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setIsIconVisible(true)}
              />
              <label className='label'>Password</label>
              {isIconVisible && (
                <button className='eye' onClick={togglePasswordVisibility}>
                  <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                </button>
              )}
            </div>
            {passwordError && <div className='error'>{passwordError}</div>}
          </div>
          <div className='login-options'>
            <div className='remember-me'>
              <input
                type='checkbox'
                id='rememberMe'
                checked={rememberMe}
                onChange={handleRememberMeChange}
              />
              <label htmlFor='rememberMe'>Nhớ mật khẩu</label>
            </div>
            <div className='forgot-password'>
              <a href='/forgot-password'>Quên mật khẩu?</a>
            </div>
          </div>

          <button
            className='btnLogin'
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? <div className='loading-spinner'></div> : 'Đăng Nhập'}
          </button>

          <div className='divcachkhac'>
            <button className='btnfacebook'>
              <img src={images.facebook} alt='' className='facebook' />
            </button>
            <button className='btngoogle'>
              <img src={images.google} alt='' className='google' />
            </button>
          </div>
          <div className='divRegister'>
            <h3 className='register1'>Bạn chưa có tài khoản?</h3>
            <h3 className='register' onClick={() => navigate('/register')}>
              Đăng ký
            </h3>
          </div>
          <div>
            <LogoSwitcherLogin />
          </div>
          <div className='chinhsach'>
            <h4>
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

export default Login
