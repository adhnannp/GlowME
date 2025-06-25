import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SocketState {
  connected: boolean;
  notifications: any[];
}

const initialState: SocketState = {
  connected: false,
  notifications: [],
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setConnected(state, action: PayloadAction<boolean>) {
      state.connected = action.payload;
    },
    addNotification(state, action: PayloadAction<any>) {
      state.notifications.unshift(action.payload);
    },
    clearNotifications(state) {
      state.notifications = [];
    },
  },
});

export const { setConnected, addNotification, clearNotifications } = socketSlice.actions;
export default socketSlice.reducer;
