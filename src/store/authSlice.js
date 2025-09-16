import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isLoggedIn: false,
    isLoading: true,
    error: null,
  },
  reducers: {
    loginStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    loginSuccess: (state, action) => {
      state.isLoading = false
      state.isLoggedIn = true
      state.user = action.payload.admin_user
      state.token = action.payload.access_token
      state.error = null
      
      localStorage.setItem('admin_token', action.payload.access_token)
      localStorage.setItem('admin_user', JSON.stringify(action.payload.admin_user))
    },
    loginFailed: (state, action) => {
      state.isLoading = false
      state.isLoggedIn = false
      state.user = null
      state.token = null
      state.error = action.payload
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isLoggedIn = false
      state.error = null
      state.isLoading = false
      
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
    },
    checkLogin: (state) => {
      const token = localStorage.getItem('admin_token')
      const user = localStorage.getItem('admin_user')
      
      if (token && user) {
        state.isLoggedIn = true
        state.token = token
        state.user = JSON.parse(user)
      } else {
        state.isLoggedIn = false
      }
      state.isLoading = false
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

// Export actions as named exports
export const { 
  loginStart, 
  loginSuccess, 
  loginFailed, 
  logout, 
  checkLogin, 
  clearError 
} = authSlice.actions

// Export reducer as default export
export default authSlice.reducer
