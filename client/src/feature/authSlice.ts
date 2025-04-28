import { createSlice } from "@reduxjs/toolkit";
import { userLogin, adminLogin, registerUser ,verifyOtp, logout} from "./authThunks";
import { UserWithBadge } from "../interfaces/auth.interface";

interface AuthState {
  user: UserWithBadge | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateUser(state, action) {
      state.user = action.payload.user;
      state.error = null;
      state.isAdmin = action.payload.user.isAdmin
      state.isAuthenticated = true
      state.loading = false
    },
  },
  extraReducers: (builder) => {
    builder
      // User login
      .addCase(userLogin.pending, (state) => { state.loading = true; })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.isAdmin = action.payload.user.isAdmin;
        state.error = null;
      })
      .addCase(userLogin.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload as string; 
      })

      // Admin login
      .addCase(adminLogin.pending, (state) => { state.loading = true; })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.isAdmin = action.payload.user.isAdmin;
        state.error = null;
      })
      .addCase(adminLogin.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload as string; 
      })

      //logout
      .addCase(logout.pending, (state) => { state.loading = true; })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isAdmin = false;
        state.error = null;
        state.loading = false;
        localStorage.clear();
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false; 
      })

      // User registration
      .addCase(registerUser.pending, (state) => { state.loading = true; })
      .addCase(registerUser.fulfilled, (state,action) => { 
        state.loading = false; 
        state.error = null;
        state.user = action.payload.user
      })
      .addCase(registerUser.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload as string; 
      })

      // Verify OTP
      .addCase(verifyOtp.pending, (state) => { state.loading = true; })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
        state.isAdmin = action.payload.user.isAdmin;
      })
      .addCase(verifyOtp.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload as string; 
      })
  },
});

export const { updateUser } = authSlice.actions;
export default authSlice.reducer;
