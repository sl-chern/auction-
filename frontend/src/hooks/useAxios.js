import axios from "axios"
import { useDispatch } from "react-redux"
import { useRefresh } from "../api/userApi"
import { changeAccessToken, changeRefreshToken } from "../store/slices/authenticationSlice"
import { changeUser, changeUserId } from "../store/slices/userSlice"
import { useSelector } from "react-redux"
import { selectAccessToken, selectRefreshToken } from "../store/slices/authenticationSlice"
import useLogout from "./useLogout"

const useAxios = () => {
  const dispatch = useDispatch()
  const refresh = useRefresh()
  const logout = useLogout()


  const accessToken = useSelector(selectAccessToken)
  const refreshToken = useSelector(selectRefreshToken)

  const instance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    headers: {
      "Content-Type": "application/json",
    },
  })

  instance.interceptors.request.use(
    (config) => {
      if (accessToken) 
        config.headers["Authorization"] = `Bearer ${accessToken}`
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )
  
  instance.interceptors.response.use(
    (res) => {
      return res
    },
    async (err) => {
      const originalConfig = err.config
  
      if(refreshToken === null)
        return Promise.reject(err)
      
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true
        try {
          refresh()
          return instance(originalConfig)
        } 
        catch (_error) {
          logout()
          return Promise.reject(_error)
        }
      }
  
      return Promise.reject(err)
    }
  )
  
  return instance
}

export default useAxios