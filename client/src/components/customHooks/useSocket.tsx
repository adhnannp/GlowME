import { useEffect } from 'react';
import { connectSocket, disconnectSocket } from '@/utils/socket';
import { useDispatch } from 'react-redux';
import { addNotification, setConnected } from '@/feature/socketSlice';
import { toast } from 'react-hot-toast';

export const useSocket = (userId: string | undefined) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userId) return;

    const socket = connectSocket(userId);

    socket.on('new_notification', (notification) => {
      dispatch(addNotification(notification));
        console.log(notification)
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <img
                  className="h-10 w-10 rounded-full"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
                  alt=""
                />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Emilia Gates
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {notification.message}
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Close
            </button>
          </div>
        </div>
      ));
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
