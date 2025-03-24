import { createSlice } from "@reduxjs/toolkit";
import { userLogin, adminLogin, registerUser ,verifyOtp} from "./authThunks";
import { User } from "../interfaces/auth.interface";

interface AuthState {
  user: User | null;
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
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
    },
    updateUser(state, action) {
      state.user = { ...state.user, ...action.payload };
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
      })
      .addCase(adminLogin.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload as string; 
      })

      // User registration
      .addCase(registerUser.pending, (state) => { state.loading = true; })
      .addCase(registerUser.fulfilled, (state,action) => { state.loading = false; state.user = action.payload.user})
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
        state.isAdmin = action.payload.user.isAdmin;
      })
      .addCase(verifyOtp.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload as string; 
      })
  },
});

export const { logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
