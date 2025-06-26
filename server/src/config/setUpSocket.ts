import IUserSocketController from '../core/interfaces/controllers/user/IUser.Socket.Controller';
import container from '../di/container';
import { TYPES } from '../di/types';
import { Server } from 'http';
import { Server as SocketIOServer } from 'socket.io';

const setUpSocket = (server: Server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  const socketController = container.get<IUserSocketController>(TYPES.UserSocketController);
  socketController.initializeSocket(io);

  return io;
};

export default setUpSocket;