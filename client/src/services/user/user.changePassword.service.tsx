// services/user/user.changePassword.service.ts
import { AxiosError } from "axios";
import api from "@/utils/axios";
import { handleApiError } from "@/utils/errorHandling";
import toast from "react-hot-toast";

interface ChangePasswordData {
  current_password: string;
  new_password: string;
}

export const changePassword = async (data: ChangePasswordData) => {
  try {
    const response = await api.patch("/users/change-password", data);
    toast.success("Password changed successfully");
    return response.data.user;
  } catch (error) {
    const err = handleApiError(error as AxiosError | Error, "Failed to change password");
    toast.error(err.message);
    throw err;
  }
};