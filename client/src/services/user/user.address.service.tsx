import api from '@/utils/axios';
import { AxiosError } from 'axios';
import { handleApiError } from '@/utils/errorHandling';
import { USER_API } from '@/config/userApi';
import IUserAddress from '@/interfaces/user.address.interface';
import toast from 'react-hot-toast';

/**
 * Fetch all user addresses
 */
export const fetchUserAddresses = async (): Promise<IUserAddress[]> => {
  try {
    const response = await api.get(USER_API.ADDRESS);
    return response.data.address || [];
  } catch (error) {
    throw handleApiError(error as AxiosError | Error, 'Failed to fetch addresses');
  }
};

/**
 * Create a new address
 */
export const createAddress = async (data: Omit<IUserAddress, '_id' | 'created_at' | 'edited_at'>): Promise<IUserAddress> => {
  try {
    const response = await api.post(USER_API.ADDRESS, data);
    toast.success('address created')
    return response.data.address;
  } catch (error) {
    throw handleApiError(error as AxiosError | Error, 'Failed to create address');
  }
};

/**
 * Update an existing address by ID
 */
export const updateAddress = async (
  id: string,
  data: Partial<IUserAddress>
): Promise<IUserAddress> => {
  try {
    const response = await api.put(USER_API.ADDRESS, data, {
      params: { id }
    });
    toast.success('selected address updated')
    return response.data.address;
  } catch (error) {
    throw handleApiError(error as AxiosError | Error, 'Failed to update address');
  }
};
