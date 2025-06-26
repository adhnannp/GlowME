import { injectable } from 'inversify';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { INotification } from '../../models/Notification';
import IUserSocketController from '../../core/interfaces/controllers/user/IUser.Socket.Controller';
import logger from '../../utils/logger';

@injectable()
export class UserSocketController implements IUserSocketController{
  private io: SocketIOServer | undefined;

  constructor(
  ) {}

  initializeSocket(io: SocketIOServer): void {
    this.io = io;

    this.io.on('connection', (socket: Socket) => {
      console.log('New Socket.IO connection:', socket.id);

      socket.on('register', (userId: string) => {
        socket.join(userId);
        logger.info(`User ${userId} registered with socket ${socket.id}`);
      });

      socket.on('disconnect', () => {
        logger.info('Socket.IO disconnected:', socket.id);
      });
    });
  }

  emitNotification(userId: string, notification: INotification): void {
    if (this.io) {
        this.io.to(userId).emit('new_notification', notification);
    } else {
        logger.error('Socket.IO server not initialized');
    }
  }

}