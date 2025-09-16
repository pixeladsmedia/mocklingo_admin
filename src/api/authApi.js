import { loginStart, loginFailed, loginSuccess } from "../store/authSlice"
import { api } from "./api"

export const loginAdmin = (username, password) => async (dispatch) => {
  dispatch(loginStart())

  try {
    const response = await api.post("/admin/auth/login", {
      username: username,
      password: password,
    })

    dispatch(loginSuccess(response.data))
  } catch (error) {
    let errorMessage = "Login failed"

    if (error.response?.data?.detail) {
      errorMessage = error.response.data.detail
    } else if (error.response?.status === 401) {
      errorMessage = "Wrong username or password"
    }

    dispatch(loginFailed(errorMessage))
  }
}

// No default export here - only named exports