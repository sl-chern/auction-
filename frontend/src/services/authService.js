import { useDispatch } from 'react-redux'
import useAxios from '../hooks/useAxios'
import { useSelector } from 'react-redux'
import { changeAccessToken, changeRefreshToken, selectDeviceId, selectRefreshToken } from '../store/slices/authenticationSlice'
import { changeUser, changeUserId } from '../store/slices/userSlice'
import useLogout from '../hooks/useLogout'
import axios from 'axios'

const useAuthService = () => {
  const dispatch = useDispatch()
  const deviceId = useSelector(selectDeviceId)
  const axiosInstance = useAxios()
  const logout = useLogout()

  const authService = {
    authenticate: async (token) => {
      try {
        const url = "http://localhost:5000/api/user/authenticate"

        const data = {
          token: token,
          deviceId: deviceId
        }
  
        const res = await axiosInstance.post(url, JSON.stringify(data), {
          headers: {
            "Content-Type": "application/json",
          }
        })

        dispatch(changeAccessToken(res.data.accessToken))
        dispatch(changeRefreshToken(res.data.refreshToken))
        dispatch(changeUserId(res.data.userInfo.id))
        dispatch(changeUser(res.data.userInfo))
      }
      catch(err) {
        console.log(err)
      }
    },
    
    logout: async () => {
      try {
        const url = "http://localhost:5000/api/user/logout"
  
        const data = {
          deviceId: deviceId
        }

        await axiosInstance.post(url, JSON.stringify(data), {
          headers: {
            "Content-Type": "application/json",
          }
        })

        logout()
      }
      catch(err) {
        console.log(err)
      }
    },

    getUser: async (id) => {
      const url = `http://localhost:5000/api/user/${id}`

      const res = await axiosInstance.get(url, {
        headers: {
          "Content-Type": "application/json",
        }
      })

      return res.data
    }
  }

  return authService
}

export default useAuthService

export const useRefresh = () => {
  const deviceId = useSelector(selectDeviceId)
  const refreshToken = useSelector(selectRefreshToken)
  const dispatch = useDispatch()
  const logout = useLogout()

  const refresh = async () => {
    try {
      const url = `${import.meta.env.VITE_SERVER_URL}/user/refresh`

      const data = {
        deviceId: deviceId,
        refreshToken: refreshToken
      }

      const res = await axios.post(url, JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
        }
      })

      dispatch(changeAccessToken(res.data.accessToken))
      dispatch(changeRefreshToken(res.data.refreshToken))
    }
    catch(err) {
      if(err.response?.status === 401) {
        logout()
      }
      console.log(err)
    }
  }

  return refresh
}