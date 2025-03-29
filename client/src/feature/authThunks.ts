import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginUserAPI, registerUserAPI, fetchUserAPI, loginAdminAPI, verifyOtpAPI } from "./api/auth.api";
import { UserCredentials, RegisterUserData, Otp } from "@/interfaces/auth.interface";

// User login thunk
export const userLogin = createAsyncThunk<any, UserCredentials, { rejectValue: string }>(
  "auth/userLogin",
  async (credentials, thunkAPI) => {
    try {
      const loginResponse = await loginUserAPI(credentials);
      const userData = await fetchUserAPI(credentials.email);
      return { ...loginResponse, user: userData.user };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Admin login thunk
export const adminLogin = createAsyncThunk<any, UserCredentials, { rejectValue: string }>(
  "auth/adminLogin",
  async (credentials, thunkAPI) => {
    try {
      const loginResponse = await loginAdminAPI(credentials);
      const userData = await fetchUserAPI(credentials.email);
      return { ...loginResponse, user: userData };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// User registration thunk
export const registerUser = createAsyncThunk<any, RegisterUserData, { rejectValue: string }>(
  "auth/registerUser",
  async (userDetails, thunkAPI) => {
    try {
      return await registerUserAPI(userDetails);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// OTP verification thunk
export const verifyOtp = createAsyncThunk<any, Otp, { rejectValue: string }>(
  "auth/verifyOtp",
  async (credentials, thunkAPI) => {
    try {
      const verifyResponse = await verifyOtpAPI(credentials);
      const userData = await fetchUserAPI(credentials.email); 
      return { ...verifyResponse, user: userData.user };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
