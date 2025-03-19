import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../feature/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
