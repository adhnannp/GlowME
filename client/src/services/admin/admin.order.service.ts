import api from "@/utils/axios";
import { ADMIN_API } from "@/config/adminApi";
import { AxiosError } from "axios";
import { handleApiError } from "@/utils/errorHandling";
import { User } from "@/interfaces/auth.interface";
import { Reward } from "@/components/admin/Reward/RewardTable";
import IOrder from "@/interfaces/user.order.interface";

export interface Order {
  _id: string;
  orderId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  user_id:User
  reward_id:Reward
}

export interface PaginatedOrders {
  orders: IOrder[];
  total: number;
  page: number;
  limit: number;
}
    

export const fetchOrders = async (
  page = 1,
  limit = 10
): Promise<PaginatedOrders> => {
  try {
    const response = await api.get(ADMIN_API.GET_ORDERS, {
      params: { page, limit },
    });
    return response.data;
  } catch (err) {
    const error = handleApiError(err as AxiosError | Error, "Failed to fetch orders");
    console.error("Error fetching orders:", err);
    throw error;
  }
};

export const fetchOneOrder = async (orderId: string): Promise<Order> => {
  try {
    const response = await api.get(`${ADMIN_API.GET_ORDER}/${orderId}`);
    return response.data.order;
  } catch (err) {
    const error = handleApiError(err as AxiosError | Error, "Failed to fetch order");
    console.error("Error fetching order:", err);
    throw error;
  }
};

export const changeOrderStatus = async (
  orderId: string,
  status: string
): Promise<IOrder> => {
  try {
    const response = await api.patch(`${ADMIN_API.GET_ORDER}/${orderId}`, { status });
    return response.data.order;
  } catch (err) {
    const error = handleApiError(err as AxiosError | Error, "Failed to update order status");
    console.error("Error updating order status:", err);
    throw error;
  }
};
