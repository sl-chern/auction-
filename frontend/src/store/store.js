import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authenticationSlice from './slices/authenticationSlice'
import themeSlice from './slices/themeSlice'
import userSlice from './slices/userSlice'
import { userApi } from '../services/userService'
import { lotApi } from '../services/lotService'

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['userAPI', 'lotAPI', 'betAPI']
}

const rootReducer = combineReducers({
  authenticationSlice,
  themeSlice,
  userSlice,
  [userApi.reducerPath]: userApi.reducer,
  [lotApi.reducerPath]: lotApi.reducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
      .concat(userApi.middleware)
      .concat(lotApi.middleware),
  devTools: import.meta.env.NODE_ENV !== 'production',
})

export default store
