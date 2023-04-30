import { fetchBaseQuery } from "@reduxjs/toolkit/dist/query"
import { changeAccessToken, changeRefreshToken } from "../store/slices/authenticationSlice"
import { Mutex } from 'async-mutex'

const mutex = new Mutex()

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_SERVER_URL,
  prepareHeaders: (headers, {getState}) => {
    const accessToken = getState().authenticationSlice.accessToken
    if(accessToken) {
      headers.set("authorization", `Bearer ${accessToken}`)
    }
    return headers
  }
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
  await mutex.waitForUnlock()

  let result = await baseQuery(args, api, extraOptions)

  if(result?.error?.originalStatus === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire()

      try {
        const refreshResult = await baseQuery({
          url: '/user/refresh',
          body: JSON.stringify({
            deviceId: api.getState().authenticationSlice.deviceId,
            refreshToken: api.getState().authenticationSlice.refreshToken
          }),
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        }, api, extraOptions)

        if(refreshResult?.data) {
          api.dispatch(changeAccessToken(refreshResult?.data.accessToken))
          api.dispatch(changeRefreshToken(refreshResult?.data.refreshToken))

          result = await baseQuery(args, api, extraOptions)
        }
      }
      finally {
        release()
      }
    }
    else {
      await mutex.waitForUnlock()
      result = await baseQuery(args, api, extraOptions)
    }
  }

  return result
}

export default baseQueryWithReauth