import React from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '../../store/slices/userSlice'
import userPlaceholderPicture from '../../assets/user-placeholder.png'
import useUserApi from '../../api/userApi'

export default function UserPopup({visibility, optionsRef, setVisibility}) {

  const userApi = useUserApi()

  const userInfro = useSelector(selectUser)

  const logout = () => {
    userApi.logout()
    setVisibility(false)
  }

  if(visibility)
    return (
      <div className="user-popup" ref={optionsRef}>
        <a href={`/user/${userInfro?.id}`}>
          <div className="user-popup__info">
            <div className="user-popup__photo">
              <img src={userInfro?.image || userPlaceholderPicture} alt="User"/>
            </div>
            <div className="user-popup__full-name">
              <p>{userInfro?.firstName} {userInfro?.lastName}</p>
            </div>
          </div>
        </a>
        <div className="user-popup__logout-button" onClick={() => logout()}>
          <p>Вийти</p>
        </div>
      </div>
    )
  else
    return null
}
