import { handleApiError } from "@/utils/errorHandling";
import api from "@/utils/axios";
import { AxiosError } from "axios";
import { USER_API } from "@/config/userApi";

export const getCoinPlans = async () => {
    try {
      const response = await api.get(USER_API.GET_COIN_PLANS);
      if(response.data.data.length==0){
        throw new Error('No GCoin Plan Found')
      }
      return response.data.data;
    } catch (error) {
      const err = handleApiError(error as AxiosError | Error, 'no coin plans found');
      throw err;
    }
};

export const createCheckoutSession = async (planId: string) => {
  try {
    const response = await api.post(USER_API.GCOIN_CHECKOUT, { planId });
    if (!response.data.sessionId) {
      throw new Error(response.data.message || "Failed to create checkout session");
    }
    return response.data.sessionId;
  } catch (error) {
    const err = handleApiError(error as AxiosError | Error, "failed to create checkout session");
    throw err;
  }
};

export const PaymentSuccessDetails = async (sessionId:string) => {
  try {
    const response = await api.get(`${USER_API.GCOIN_PAYMENT_SUCCESS}/${sessionId}`)
    if (!response.data.transactionData || !response.data.updatedUser) {
      throw new Error(response.data.message || "Failed to create checkout session");
    }
    return response.data;
  } catch (error) {
    const err = handleApiError(error as AxiosError | Error, "failed to create checkout session");
    throw err;
  }
}

export const transactionHistory = async(page:number)=>{
  try {
    const response = await api.get(`${USER_API.GCOIN_TRANSACTION}?page=${page}`)
    return response.data;
  } catch (error) {
    const err = handleApiError(error as AxiosError | Error, "No transaction History Found");
    throw err;
  }
}