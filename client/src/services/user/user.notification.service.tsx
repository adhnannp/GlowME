import { handleApiError } from '@/utils/errorHandling';
import api from '@/utils/axios';
import { AxiosError } from 'axios';
import { USER_API } from '@/config/userApi';
import { ConnectionNotification } from '@/interfaces/notification';

export const fetchNotifications = async (page: number): Promise<ConnectionNotification[]> => {
  try {
    const response = await api.get(`${USER_API.FETCH_NOTIFICATION}?&page=${page}`);
    return response.data.notifications || [];
  } catch (error) {
    const err = handleApiError(error as AxiosError | Error, 'Failed to fetch notifications');
    throw err;
  }
};

export const HasUnreadNotification = async () => {
  try {
    const response = await api.get(USER_API.HAS_UNREAD_NOTIFICATION)
    return response.data;
  } catch (error) {
    const err = handleApiError(error as AxiosError | Error, 'Failed to look unread Notification');
    throw err;
  }
};

export const markAllNotificationsAsRead = async () => {
    try {
        const res = await api.patch(USER_API.MARK_ALL_AS_READ);
        return res.data;
    } catch (error) {
        const err = handleApiError(error as AxiosError | Error, 'Failed to mark all notification as read');
        throw err;
    }
};
