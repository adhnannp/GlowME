import { USER_API } from "@/config/userApi";
import api from "@/utils/axios";
import { handleApiError } from "@/utils/errorHandling";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

interface UpdateProfileData {
  username: string;
  profile_image?: File | null;
}

export const updateUserProfile = async (data: UpdateProfileData) => {
  try {
    const formData = new FormData();
    formData.append("username", data.username);
    if (data.profile_image) {
      formData.append("profile_image", data.profile_image, "profile.jpg");
    }

    const response = await api.patch(USER_API.EDIT_PROFILE, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    toast.success("Profile updated successfully");
    return response.data.user;
  } catch (error) {
    const err = handleApiError(
      error as AxiosError | Error,
      "Failed to update profile"
    );
    toast.error(err.message);
    throw err;
  }
};
