import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  dark: null
}

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    changeTheme: (state, action) => {
      state.dark = action.payload
    }
  }
})

export const {changeTheme} = themeSlice.actions

export const selectTheme = (state) => state.themeSlice.dark

export default themeSlice.reducer