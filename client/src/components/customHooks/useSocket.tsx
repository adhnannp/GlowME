import { useEffect } from 'react';
import { connectSocket, disconnectSocket } from '@/utils/socket';
import { useDispatch } from 'react-redux';
import { addNotification, setConnected } from '@/feature/socketSlice';
import { toast } from 'react-hot-toast';
import NotificationToast from '../ui/connection-notification';

export const useSocket = (userId: string | undefined) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userId) return;

    const socket = connectSocket(userId);

    socket.on('new_notification', (notification) => {
      dispatch(addNotification(notification));
      toast.custom(
        (t) => <NotificationToast t={t} notification={notification} />,
        { position: "bottom-right" });
      });

    socket.on('connect', () => dispatch(setConnected(true)));
    socket.on('disconnect', () => dispatch(setConnected(false)));

    return () => {
        socket.off('new_notification');
        socket.off('connect');
        socket.off('disconnect');
        disconnectSocket();
    };
  }, [userId, dispatch]);
};
