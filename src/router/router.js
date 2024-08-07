import { Login } from "../Layout/LoginLayout"
import { Home } from "../Layout/DeafaultLayout"
const publicRoutes = [
  { path: '/', component: Login },
  { path: '/home', component: Home },
 
]
const privateRoutes = []
export { publicRoutes, privateRoutes }
