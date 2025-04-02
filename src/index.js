import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { GlobalStyles } from './components/GlobalStyles'

const root = ReactDOM.createRoot(document.getElementById('root'))

// Custom console message to match the image
console.log('%cDừng lại!', 'color: red; font-size: 30px; font-weight: bold;')
console.log(
  '%cĐây là một tính năng của trình duyệt dành cho các nhà phát triển. Nếu ai đó bảo bạn sao chép-dán nội dung nào đó vào đây để bật một tính năng của Bicraft hoặc "hack" tài khoản của người khác, thì đó là hành vi lừa đảo và sẽ khiến họ có thể truy cập vào tài khoản Bicraft của bạn.',
  'color: black; font-size: 14px;'
)

root.render(
  <React.StrictMode>
    <GlobalStyles>
      <App />
    </GlobalStyles>
  </React.StrictMode>
)

reportWebVitals()
