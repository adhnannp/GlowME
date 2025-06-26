import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../feature/authSlice";
import socketReducer from "../feature/socketSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    socket: socketReducer,
  },
  devTools:true
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;