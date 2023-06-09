import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  bought: [],
  boughtSkip: 0,
  sold: [],
  soldSkip: 0,
}

const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState: initialState,
  reducers: {
    changeBought: (state, action) => {
      state.bought = action.payload
    },
    changeBoughtSkip: (state, action) => {
      state.boughtSkip = action.payload
    },
    changeSold: (state, action) => {
      state.sold = action.payload
    },
    changeSoldSkip: (state, action) => {
      state.soldSkip = action.payload
    },
  }
})

export default userOrdersSlice.reducer

export const { 
  changeBought, 
  changeBoughtSkip, 
  changeSold, 
  changeSoldSkip, 
} = userOrdersSlice.actions

export const selectBought = (state) => state.userOrdersSlice.bought
export const selectBoughtSkip = (state) => state.userOrdersSlice.boughtSkip
export const selectSold = (state) => state.userOrdersSlice.sold
export const selectSoldSkip = (state) => state.userOrdersSlice.soldSkip