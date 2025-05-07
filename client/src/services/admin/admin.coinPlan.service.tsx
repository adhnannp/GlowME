import { AxiosError } from 'axios';
import api from '@/utils/axios';
import { handleApiError } from '@/utils/errorHandling';
import toast from 'react-hot-toast';
import { ADMIN_API } from '@/config/adminApi';

export interface CoinPlanData {
  title: string;
  coins: number;
  price: number;
}

export const createCoinPlan = async (data: CoinPlanData) => {
  try {
    const response = await api.post(ADMIN_API.COIN_PLANS, data);
    toast.success('Coin plan created successfully');
    return response.data.data;
  } catch (error) {
    const err = handleApiError(error as AxiosError | Error, 'Failed to create coin plan');
    toast.error(err.message);
    throw err;
  }
};

export const getAllCoinPlans = async () => {
  try {
    const response = await api.get(ADMIN_API.COIN_PLANS);
    return response.data;
  } catch (error) {
    const err = handleApiError(error as AxiosError | Error, 'Failed to fetch coin plans');
    toast.error(err.message);
    throw err;
  }
};

export const updateCoinPlan = async (id: string, data: CoinPlanData) => {
  try {
    const response = await api.patch(`${ADMIN_API.COIN_PLANS}/${id}`, data);
    toast.success('Coin plan updated successfully');
    return response.data.data;
  } catch (error) {
    const err = handleApiError(error as AxiosError | Error, 'Failed to update coin plan');
    toast.error(err.message);
    throw err;
  }
};

export const listCoinPlan = async (id: string) => {
  try {
    const response = await api.post(`${ADMIN_API.COIN_PLANS}/${id}/list`);
    toast.success('Coin plan listed successfully');
    return response.data.data;
  } catch (error) {
    const err = handleApiError(error as AxiosError | Error, 'Failed to list coin plan');
    toast.error(err.message);
    throw err;
  }
};

export const unlistCoinPlan = async (id: string) => {
  try {
    const response = await api.post(`${ADMIN_API.COIN_PLANS}/${id}/unlist`);
    toast.success('Coin plan unlisted successfully');
    return response.data.data;
  } catch (error) {
    const err = handleApiError(error as AxiosError | Error, 'Failed to unlist coin plan');
    toast.error(err.message);
    throw err;
  }
};