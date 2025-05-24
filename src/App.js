import React, { Fragment } from 'react'
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom'
import { publicRoutes } from './router'
import { DefaultLayout } from './Layout/DeafaultLayout'
import DefaultBanHangLayout from './Layout/BanHangLayout/DefaultBanHangLayout'
import ToastProvider from './components/GlobalStyles/ToastContext'
import PrivateRoute from './components/PrivateRoutes/PrivateRoutes'
import { SolenhProvider } from './components/SoLenhContext/SoLenhContext'
function App () {
  return (
    <ToastProvider>
      <SolenhProvider>
        <Router>
          <div className='App'>
            <Routes>
              {publicRoutes.map((route, index) => {
                const Page = route.component
                let Layout = DefaultLayout
                if (route.layout === 'banhang') Layout = DefaultBanHangLayout
                if (route.layout === null) Layout = Fragment

                const isPublic =
                  route.path === '/' ||
                  route.path === '/register' ||
                  route.layout === null

                const element = (
                  <Layout>
                    <Page />
                  </Layout>
                )

                return (
                  <Route
                    key={index}
                    path={route.path}
                    element={
                      isPublic ? (
                        element
                      ) : (
                        <PrivateRoute>{element}</PrivateRoute>
                      )
                    }
                  />
                )
              })}
            </Routes>
          </div>
        </Router>
      </SolenhProvider>
    </ToastProvider>
  )
}

export default App
