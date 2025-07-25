import api from '@/utils/axios';
import { AxiosError } from 'axios';
import { handleApiError } from '@/utils/errorHandling';
import { USER_API } from '@/config/userApi';
import IOrder, { IOrderWithProduct } from '@/interfaces/user.order.interface';

interface returnType{
  orders:IOrder[];
  limit:number;
  page:number;
  total:number;
}

export const fetchUserOrders = async (
  page = 1,
  limit = 10
): Promise<returnType> => {
  try {
    const response = await api.get(USER_API.FETCH_ORDERS, {
      params: { page, limit },
    });
    return response.data || [];
  } catch (error) {
    throw handleApiError(error as AxiosError | Error, 'Failed to fetch orders');
  }
};

export const fetchOrderById = async (orderId: string): Promise<IOrderWithProduct> => {
  try {
    const response = await api.get(`${USER_API.FETCH_ORDER_BY_ID.replace(':orderId', orderId)}`);
    return response.data.order;
  } catch (error) {
    throw handleApiError(error as AxiosError | Error, 'Failed to fetch order');
  }
};

export const cancelOrder = async (orderId: string): Promise<IOrder> => {
  try {
    const response = await api.put(`${USER_API.CANCEL_ORDER.replace(':orderId', orderId)}`);
    return response.data.updatedOrder;
  } catch (error) {
    throw handleApiError(error as AxiosError | Error, 'Failed to cancel order');
  }
};
