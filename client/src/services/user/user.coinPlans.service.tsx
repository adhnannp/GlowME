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