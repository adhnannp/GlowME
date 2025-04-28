import { AxiosError } from "axios";
import api from "@/utils/axios";
import { handleApiError } from "@/utils/errorHandling";
import toast from "react-hot-toast";
import { USER_API } from "@/config/userApi";

interface ChangePasswordData {
  current_password: string;
  new_password: string;
  googleUser?: boolean;
}

export const changePassword = async (data: ChangePasswordData) => {
  try {
    const response = await api.patch(USER_API.CHANGE_PASSWORD, data);
    toast.success("Password changed successfully");
    return response.data;
  } catch (error) {
    const err = handleApiError(error as AxiosError | Error, "Failed to change password");
    toast.error(err.message);
    throw err;
  }
};

export const checkUserHasPassword = async () => {
  try {
    const response = await api.get(USER_API.CHECK_PASSWORD_STATUS);
    return response.data;
  } catch (error) {
    const err = handleApiError(error as AxiosError | Error, "Failed to check password status");
    throw err;
  }
};