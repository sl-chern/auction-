import React, { useEffect } from 'react'
import './App.css'
import {Routes, Route} from 'react-router-dom'
import useDarkMode from './hooks/useDarkMode'
import { useDispatch, useSelector } from 'react-redux'
import { changeDeviceId, selectAccessToken, selectDeviceId } from './store/slices/authenticationSlice'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import jwtDecode from 'jwt-decode'
import { changeUserId } from './store/slices/userSlice'
import { v4 as uuid } from 'uuid'
import User from './pages/User/User'
import Lot from './pages/Lot/Lot'
import Catalog from './pages/Catalog/Catalog'
import Wins from './pages/Wins/Wins'
import Checkout from './pages/Checkout/Checkout'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import CreateLot from './pages/CreateLot/CreateLot'
import UpdateLot from './pages/UpdateLot/UpdateLot'

function App() {
  const dispatch = useDispatch()

  const accessToken = useSelector(selectAccessToken)
  
  const [mode, setMode] = useDarkMode()

  const deviceId = useSelector(selectDeviceId)

  useEffect(() => {
    if(deviceId === null) {
      dispatch(changeDeviceId(uuid()))
    }
    if(localStorage.getItem("mode") === null) {
      if (window.matchMedia) {
        if(window.matchMedia('(prefers-color-scheme: dark)').matches){
          setMode(true);
        } else {
          setMode(false)
        }
      } else {
        setMode(true)
      }
    }
  }, [])

  useEffect(() => {
    if(accessToken) {
      const infoFromJwt = jwtDecode(accessToken)
      dispatch(changeUserId(infoFromJwt.id))
    }
  }, [accessToken])

  return (
    <div className="flex flex-col justify-between min-h-screen bg-light-200 dark:bg-dark-100">
      <div className="grow flex flex-col">
        <Header />

        <main>
          <Routes>
            <Route exact path='/' element={<></>}/>
            <Route exact path='/user/:id' element={<User />}/>
            <Route exact path='/lot/:id/edit' element={<UpdateLot />}/>
            <Route exact path='/lot/:id' element={<Lot />}/>
            <Route exact path='/catalog' element={<Catalog />}/>
            <Route exact path='/wins' element={<Wins />}/>
            <Route exact path='/wins/:id/delivery' element={<Checkout />}/>
            <Route exact path='/create' element={<CreateLot />}/>
            <Route exact path='*' element={<>404</>}/>
          </Routes>
          <ToastContainer 
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            position='top-right'
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={mode ? 'dark' : 'light'}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              height: '100%',
              overflow: 'hidden'
            }}
          />
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default App
