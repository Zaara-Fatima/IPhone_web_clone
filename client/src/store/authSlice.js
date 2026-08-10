import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { loginUser, registerUser, logoutUser } from "../api/authApi"
import { fetchUserProfile, updateUserProfile, fetchAllUsers } from "../api/usersApi"

// ========================
// THUNKS
// ========================
export const loginThunk = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      return await loginUser(credentials)
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed")
    }
  }
)

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      return await registerUser(userData)
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Register failed")
    }
  }
)

export const fetchProfileThunk = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchUserProfile()
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch profile")
    }
  }
)

export const updateProfileThunk = createAsyncThunk(
  "auth/updateProfile",
  async (userData, { rejectWithValue }) => {
    try {
      return await updateUserProfile(userData)
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update profile")
    }
  }
)

export const fetchAllUsersThunk = createAsyncThunk(
  "auth/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchAllUsers()
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch users")
    }
  }
)

// ========================
// SLICE
// ========================
const authSlice = createSlice({
  name: "auth",
  initialState: {
    status: false,
    userData: null,
    allUsers: [],       // admin only
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      logoutUser()
      state.status = false
      state.userData = null
      state.error = null
    },
    clearAuthError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false
        state.status = true
        state.userData = action.payload
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Register
      .addCase(registerThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false
        state.status = true
        state.userData = action.payload
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Fetch profile
      .addCase(fetchProfileThunk.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchProfileThunk.fulfilled, (state, action) => {
        state.loading = false
        state.userData = action.payload
        state.status = true
      })
      .addCase(fetchProfileThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Update profile
      .addCase(updateProfileThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateProfileThunk.fulfilled, (state, action) => {
        state.loading = false
        state.userData = action.payload  // fresh data from backend
      })
      .addCase(updateProfileThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Fetch all users (admin)
      .addCase(fetchAllUsersThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllUsersThunk.fulfilled, (state, action) => {
        state.loading = false
        state.allUsers = action.payload
      })
      .addCase(fetchAllUsersThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { logout, clearAuthError } = authSlice.actions
export default authSlice.reducer