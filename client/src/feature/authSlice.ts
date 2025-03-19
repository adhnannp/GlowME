import { createSlice } from "@reduxjs/toolkit";
import { userLogin, adminLogin, registerUser, fetchUserFromToken } from "./authThunks";
import { User } from "../interfaces/auth.interface";
import Cookies from "js-cookie";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  authToken: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  authToken: Cookies.get("authToken") ?? null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
      state.authToken = null;
    },
    updateUser(state, action) {
      state.user = { ...state.user, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserFromToken.pending, (state) => { state.loading = true; })
      .addCase(fetchUserFromToken.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.authToken = action.payload.token;
        state.user = action.payload.user;
        state.isAdmin = action.payload.user.isAdmin;
      })
      .addCase(fetchUserFromToken.rejected, (state, action) => { state.loading = false; state.error = (action.payload as string); })
      
      .addCase(userLogin.pending, (state) => { state.loading = true; })
      .addCase(userLogin.fulfilled, (state, _) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.authToken = Cookies.get("authToken") ?? null;
      })
      .addCase(userLogin.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      
      .addCase(adminLogin.pending, (state) => { state.loading = true; })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.authToken = Cookies.get("authToken") ?? null;
        state.user = action.payload.user;
        state.isAdmin = action.payload.user.isAdmin;
      })
      .addCase(adminLogin.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      
      .addCase(registerUser.pending, (state) => { state.loading = true; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.authToken = Cookies.get("authToken") ?? null;
        state.user = action.payload.user;
        state.isAdmin = action.payload.user.isAdmin;
      })
      .addCase(registerUser.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
  },
});

export const { logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
