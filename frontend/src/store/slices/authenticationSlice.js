import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  deviceId: null,
  accessToken: null,
  refreshToken: null,
  errors: null,
  loading: false
}

const authenticationSlice = createSlice({
  name: 'authentication',
  initialState: initialState,
  reducers: {
    changeDeviceId: (state, action) => {
      state.deviceId = action.payload
    },
    changeAccessToken: (state, action) => {
      state.accessToken = action.payload
    },
    changeRefreshToken: (state, action) => {
      state.refreshToken = action.payload
    },
    changeAuthenticationErrors: (state, action) => {
      state.errors = action.payload
    },
    changeAuthenticationLoading: (state, action) => {
      state.loading = action.payload
    }
  }
})

export default authenticationSlice.reducer

export const { changeDeviceId, changeAccessToken, changeRefreshToken, changeAuthenticationErrors, changeAuthenticationLoading } = authenticationSlice.actions

export const selectDeviceId = (state) => state.authenticationSlice.deviceId
export const selectAccessToken = (state) => state.authenticationSlice.accessToken
export const selectRefreshToken = (state) => state.authenticationSlice.refreshToken
