import { handleApiError } from '@/utils/errorHandling';
import api from '@/utils/axios';
import { AxiosError } from 'axios';
import { USER_API } from '@/config/userApi';
import IReward from '@/interfaces/user.reward.interface';

export const fetchRewards = async (): Promise<IReward[]> => {
  try {
    const response = await api.get(USER_API.FETCH_REWARD);
    return response.data.rewards || [];
  } catch (error) {
    const err = handleApiError(error as AxiosError | Error, 'Failed to fetch Rewards');
    throw err;
  }
};