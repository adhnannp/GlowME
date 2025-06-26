import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const connectSocket = (userId: string) => {
  if (!socket) {
    socket = io(import.meta.env.VITE_BASE_URL, {
      withCredentials: true,
    });

    socket.on('connect', () => {
      console.log('Connected:', socket?.id);
      socket?.emit('register', userId);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected:', socket?.id);
    });
  }

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
