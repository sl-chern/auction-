import React, { useState, useEffect, useRef } from 'react'
import {FaSun, FaBlind} from 'react-icons/fa'
import {BsMoonStarsFill} from 'react-icons/bs'
import useDarkMode from '../../hooks/useDarkMode'
import './Header.css'
import Button from '../Button/Button'
import { useGoogleLogin } from '@react-oauth/google'
import { useSelector } from 'react-redux'
import useUserApi from '../../api/userApi'
import { selectUserId } from '../../store/slices/userSlice'
import { AiOutlineBell, AiOutlineUser } from 'react-icons/ai'
import UserPopup from './UserPopup'
import useOutsideClickDetector from '../../hooks/useOutsideClickDetector'

export default function Header() {
  const [mode, setMode] = useDarkMode()
  const [toggleStyle, setToggleStyle] = useState()

  const [visibility, setVisibility] = useState(false)

  const userId = useSelector(selectUserId)

  const { loading, errors } = useSelector(state => state.authenticationSlice)

  const userApi = useUserApi()

  useEffect(() => {
    if(typeof mode == 'undefined') {
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
    mode ? setToggleStyle("toggle") : setToggleStyle("toggle switched")
  }, [mode, setMode])

  const handleToggle = () => {
    setMode(!mode)
  }

  const signIn = useGoogleLogin({
    onSuccess: async credentialResponse => userApi.authenticate(credentialResponse.access_token)
  })

  const optionsRef = useRef()
  const buttonRef = useRef()

  useOutsideClickDetector(optionsRef, buttonRef, () => {
    setVisibility(false)
  })

  return (
    <header>
      <div className="header-content">
        <a href='/'>
          <div className="header-content__logo-block">
            <p className="header-content__name-text">Auction</p>
          </div>
        </a>
        

        <div className="flex flex-row items-center">
          <div className={"toggle-switch"} onClick={() => handleToggle()}>
            <div className={toggleStyle}>
              {
                mode 
                  ? <BsMoonStarsFill size={"16px" } color="white"/>
                  : <FaBlind size={"16px" } color="black"/>
              }
            </div>
          </div>

          {
            !loading
              ? userId === null
                ? <Button loading={loading} outline={true} onClick={() => signIn()}>
                    Увійти
                  </Button>
                : <>
                    <div ref={buttonRef} className="header-content__user-button" onClick={() => visibility ? setVisibility(false) : setVisibility(true) }>
                      <AiOutlineUser className='default-icon' size={28}/>
                    </div>
                    <UserPopup optionsRef={optionsRef} visibility={visibility} setVisibility={setVisibility}/>
                  </>
              : null
          }
          

        </div>
      </div>
    </header>
  )
}
