import { Server as SocketIOServer } from 'socket.io';
import { INotification } from '../../../../models/Notification';

export default interface IUserSocketController {
  initializeSocket(io: SocketIOServer): void;
  emitNotification(userId: string, notification: INotification): void;
}
