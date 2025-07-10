import { AxiosError } from 'axios';
import api from '@/utils/axios';
import toast from 'react-hot-toast';
import { handleApiError } from '@/utils/errorHandling';
import { ADMIN_API } from '@/config/adminApi';

export interface RewardPayload {
  name: string;
  coin: number;
  description: string;
  image: File;
}

export const createReward = async (data: RewardPayload) => {
  try {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('coin', String(data.coin));
    formData.append('description', data.description);
    formData.append('image', data.image);

    const response = await api.post(ADMIN_API.REWARD_ADD, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    toast.success('Reward created successfully');
    return response.data;
  } catch (error) {
    const err = handleApiError(error as AxiosError | Error, 'Failed to create reward');
    toast.error(err.message);
    throw err;
  }
};

export const updateReward = async (
  rewardId: string,
  data: Partial<RewardPayload>
) => {
  try {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.coin !== undefined) formData.append('coin', String(data.coin));
    if (data.description) formData.append('description', data.description);
    if (data.image) formData.append('image', data.image);

    const response = await api.patch(`${ADMIN_API.REWARD_EDIT}/${rewardId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    toast.success('Reward updated successfully');
    return response.data;
  } catch (error) {
    const err = handleApiError(error as AxiosError | Error, 'Failed to update reward');
    toast.error(err.message);
    throw err;
  }
};

export const listReward = async (rewardId: string) => {
  try {
    const response = await api.patch(`${ADMIN_API.REWARD_LIST}/${rewardId}`);
    toast.success('Reward listed successfully');
    return response.data;
  } catch (error) {
    const err = handleApiError(error as AxiosError | Error, 'Failed to list reward');
    toast.error(err.message);
    throw err;
  }
};

export const unlistReward = async (rewardId: string) => {
  try {
    const response = await api.patch(`${ADMIN_API.REWARD_UNLIST}/${rewardId}`);
    toast.success('Reward unlisted successfully');
    return response.data;
  } catch (error) {
    const err = handleApiError(error as AxiosError | Error, 'Failed to unlist reward');
    toast.error(err.message);
    throw err;
  }
};

export const getAllRewards = async () => {
  try {
    const response = await api.get(ADMIN_API.REWARD_GET_ALL);
    return response.data;
  } catch (error) {
    const err = handleApiError(error as AxiosError | Error, 'Failed to fetch rewards');
    toast.error(err.message);
    throw err;
  }
};

export const getRewardById = async (rewardId: string) => {
  try {
    const response = await api.get(`${ADMIN_API.REWARD_GET_ONE}/${rewardId}`);
    return response.data;
  } catch (error) {
    const err = handleApiError(error as AxiosError | Error, 'Failed to fetch reward');
    toast.error(err.message);
    throw err;
  }
};
