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

function App() {
  const dispatch = useDispatch()

  const accessToken = useSelector(selectAccessToken)
  
  const [_, setMode] = useDarkMode()

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
            <Route exact path='/lot/:id' element={<Lot />}/>
            <Route exact path='/catalog' element={<Catalog />}/>
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default App
