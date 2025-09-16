import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'  // This should match the default export

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})

export default store
