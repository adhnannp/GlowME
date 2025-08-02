import { handleApiError } from '@/utils/errorHandling';
import api from '@/utils/axios';
import { AxiosError } from 'axios';
import { USER_API } from '@/config/userApi';
import IReward from '@/interfaces/user.reward.interface';
import IOrder from '@/interfaces/user.order.interface';

export const fetchRewards = async (): Promise<IReward[]> => {
  try {
    const response = await api.get(USER_API.FETCH_REWARD);
    return response.data.rewards || [];
  } catch (error) {
    const err = handleApiError(error as AxiosError | Error, 'Failed to fetch Rewards');
    throw err;
  }
};

export const fetchRewardById = async (rewardId: string): Promise<IReward> => {
  try {
    const response = await api.get(`${USER_API.FETCH_ONE_REWARD}?id=${rewardId}`);
    return response.data.reward;
  } catch (error) {
    throw handleApiError(error as AxiosError | Error, 'Failed to fetch reward');
  }
};

export const buyReward = async (
  rewardId: string,
  addressId: string
): Promise<IOrder> => {
  try {
    const response = await api.post(USER_API.BUY_REWARD, { rewardId, addressId });
    return response.data.newOrder;
  } catch (error) {
    throw handleApiError(error as AxiosError | Error, 'Failed to buy reward');
  }
};