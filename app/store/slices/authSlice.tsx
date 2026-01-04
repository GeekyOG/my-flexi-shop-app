import * as storage from "@/utils/storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  userType: null,
  isLoading: false,
};

// Thunk to initialize auth state from storage
export const initializeAuth = createAsyncThunk("auth/initialize", async () => {
  const user = await storage.getItem("user");
  const token = await storage.getItem("token");
  const userType = await storage.getItem("userType");
  return { user, token, userType };
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token, userType } = action.payload;
      state.user = user;
      state.token = token;
      state.userType = userType;
      storage.setItem("user", user);
      storage.setItem("token", token);
      storage.setItem("userType", userType);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.userType = null;
      storage.removeItem("user");
      storage.removeItem("token");
      storage.removeItem("userType");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.userType = action.payload.userType;
        state.isLoading = false;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
