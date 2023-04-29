import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  id: null,
  user: null
}

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    changeUserId: (state, action) => {
      state.id = action.payload
    },
    changeUser: (state, action) => {
      state.user = action.payload
    }
  }
})

export default userSlice.reducer

export const { changeUserId, changeUser } = userSlice.actions

export const selectUserId = (state) => state.userSlice.id
export const selectUser = (state) => state.userSlice.user