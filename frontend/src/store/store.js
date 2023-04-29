import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authenticationSlice from './slices/authenticationSlice'
import themeSlice from './slices/themeSlice'
import userSlice from './slices/userSlice'

const persistConfig = {
  key: 'root',
  storage,
  blacklist: []
}

const reducers = combineReducers({
  authenticationSlice,
  themeSlice,
  userSlice
})

const persistedReducer = persistReducer(persistConfig, reducers)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }),
  devTools: import.meta.env.NODE_ENV !== 'production',
})

export default store
