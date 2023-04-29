import { useDispatch } from 'react-redux'
import { changeAccessToken, changeRefreshToken } from '../store/slices/authenticationSlice'
import { changeUser, changeUserId } from '../store/slices/userSlice'

const useLogout = () => {
  const dispatch = useDispatch()

  const logout = () => {
    dispatch(changeUser(null))
    dispatch(changeUserId(null))
    dispatch(changeAccessToken(null))
    dispatch(changeRefreshToken(null))
  }

  return logout
}

export default useLogout