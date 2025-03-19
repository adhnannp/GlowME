import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginUserAPI, registerUserAPI, fetchUserAPI, loginAdminAPI } from "./api/auth.api";
import { UserCredentials, RegisterUserData } from "@/interfaces/auth.interface";

export const userLogin = createAsyncThunk<
any, 
UserCredentials, 
{ rejectValue: string }
>("auth/userLogin", async (credentials: UserCredentials, thunkAPI) => {
  try {
    const data = await loginUserAPI(credentials);
    return data;
  } catch (error:any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const adminLogin = createAsyncThunk<
any, 
UserCredentials, 
{ rejectValue: string }
>("auth/adminLogin", async (credentials: UserCredentials, thunkAPI) => {
  try {
    const data = await loginAdminAPI(credentials);
    return data;
  } catch (error:any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const registerUser = createAsyncThunk<
any, 
RegisterUserData, 
{ rejectValue: string }
>("auth/registerUser", async (userDetails: RegisterUserData, thunkAPI) => {
  try {
    return await registerUserAPI(userDetails);
  } catch (error:any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const fetchUserFromToken = createAsyncThunk<
any, 
string, 
{ rejectValue: string }
>("auth/fetchUserFromToken", async (_,thunkAPI) => {
  try {
    return await fetchUserAPI();
  } catch (error:any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});
