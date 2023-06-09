import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  allLots: [],
  allLotsSkip: 0,
  futureLots: [],
  futureLotsSkip: 0,
  activeLots: [],
  activeLotsSkip: 0,
  soldLots: [],
  soldLotsSkip: 0,
  orderedLots: [],
  orderedLotsSkip: 0,
  activeAuctions: [],
  activeAuctionsSkip: 0,
  ordered: [],
  orderedSkip: 0,
  buyed: [],
  buyedSkip: 0,
  allCurrentLots: [],
  allCurrentLotsSkip: 0,
}

const userLotsSlice = createSlice({
  name: 'userLots',
  initialState: initialState,
  reducers: {
    changeAllLots: (state, action) => {
      state.allLots = action.payload
    },
    changeAllLotsSkip: (state, action) => {
      state.allLotsSkip = action.payload
    },
    changeFutureLots: (state, action) => {
      state.futureLots = action.payload
    },
    changeFutureLotsSkip: (state, action) => {
      state.futureLotsSkip = action.payload
    },
    changeActiveLots: (state, action) => {
      state.activeLots = action.payload
    },
    changeActiveLotsSkip: (state, action) => {
      state.activeLotsSkip = action.payload
    },
    changeSoldLots: (state, action) => {
      state.soldLots = action.payload
    },
    changeSoldLotsSkip: (state, action) => {
      state.soldLotsSkip = action.payload
    },
    changeOrderedLots: (state, action) => {
      state.orderedLots = action.payload
    },
    changeOrderedLotsSkip: (state, action) => {
      state.orderedLotsSkip = action.payload
    },
    changeActiveAuctions: (state, action) => {
      state.activeAuctions = action.payload
    },
    changeActiveAuctionsSkip: (state, action) => {
      state.activeAuctionsSkip = action.payload
    },
    changeBuyed: (state, action) => {
      state.buyed = action.payload
    },
    changeBuyedSkip: (state, action) => {
      state.buyedSkip = action.payload
    },
    changeOrdered: (state, action) => {
      state.ordered = action.payload
    },
    changeOrderedSkip: (state, action) => {
      state.orderedSkip = action.payload
    },
    changeAllCurrentLots: (state, action) => {
      state.allCurrentLots = action.payload
    },
    changeAllCurrentLotsSkip: (state, action) => {
      state.allCurrentLotsSkip = action.payload
    },
  }
})

export default userLotsSlice.reducer

export const { 
  changeAllLots, 
  changeAllLotsSkip, 
  changeActiveLots, 
  changeActiveLotsSkip, 
  changeFutureLots, 
  changeFutureLotsSkip, 
  changeOrderedLots, 
  changeOrderedLotsSkip, 
  changeSoldLots, 
  changeSoldLotsSkip, 
  changeActiveAuctions, 
  changeActiveAuctionsSkip, 
  changeBuyed, 
  changeBuyedSkip, 
  changeOrdered, 
  changeOrderedSkip,
  changeAllCurrentLots,
  changeAllCurrentLotsSkip
} = userLotsSlice.actions

export const selectAllLots = (state) => state.userLotsSlice.allLots
export const selectAllLotsSkip = (state) => state.userLotsSlice.allLotsSkip
export const selectFutureLots = (state) => state.userLotsSlice.futureLots
export const selectFutureLotsSkip = (state) => state.userLotsSlice.futureLotsSkip
export const selectActiveLots = (state) => state.userLotsSlice.activeLots
export const selectActiveLotsSkip = (state) => state.userLotsSlice.activeLotsSkip
export const selectSoldLots = (state) => state.userLotsSlice.soldLots
export const selectSoldLotsSkip = (state) => state.userLotsSlice.soldLotsSkip
export const selectOrderedLots = (state) => state.userLotsSlice.orderedLots
export const selectOrderedLotsSkip = (state) => state.userLotsSlice.orderedLotsSkip
export const selectActiveAuctions = (state) => state.userLotsSlice.activeAuctions
export const selectActiveAuctionsSkip = (state) => state.userLotsSlice.activeAuctionsSkip
export const selectOrdered = (state) => state.userLotsSlice.ordered
export const selectOrderedSkip = (state) => state.userLotsSlice.orderedSkip
export const selectBuyed = (state) => state.userLotsSlice.buyed
export const selectBuyedSkip = (state) => state.userLotsSlice.buyedSkip
export const selectAllCurrentLots = (state) => state.userLotsSlice.allCurrentLots
export const selectAllCurrentLotsSkip = (state) => state.userLotsSlice.allCurrentLotsSkip