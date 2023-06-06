import { io } from 'socket.io-client'
import { useRefresh } from '../services/authService'
import { useSelector } from 'react-redux'
import { selectAccessToken } from '../store/slices/authenticationSlice'
import { toast } from 'react-toastify'

const useSocket = () => {
  const refresh = useRefresh()
  const accessToken = useSelector(selectAccessToken)
  
  const socket = io('ws://localhost:5000')

  socket.on('connect', () => {
    console.log('connected to server')
  })

  socket.on('disconnect', () => {
    console.log('disconnected')
  })

  socket.on('customError', async data => {
    console.log(data)
    try {
      if(+data.error === 401) {
        await refresh()
        socket.emit(data.event, {
          ...data.data,
          accessToken
        })
      }
      if(+data.error === 403) {
        if(data.event === 'createBet')
          toast.error('Ви не можете створити ставку')
        if(data.event === 'createOffer')
          toast.error('Ви не можете створити пропозицію')
      }
    }
    catch(err) {
      console.log(err);
    }
    console.log(data)
  })

  return socket
}

export default useSocket