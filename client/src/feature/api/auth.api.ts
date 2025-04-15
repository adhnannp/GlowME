import api from "@/utils/axios";
import { UserCredentials, RegisterUserData, Otp } from "@/interfaces/auth.interface";
import handleApiError from "@/lib/dryErrorHandling";

export const loginUserAPI = async (credentials: UserCredentials) => {
  try {
    const response = await api.post("/login", credentials);
    console.log("Login success:", response);
    localStorage.clear();
    localStorage.setItem("accessToken", response.data.accessToken);
    return response.data;
  } catch (err: any) {
    handleApiError(err, "Login failed");
  }
};

export const loginAdminAPI = async (credentials: UserCredentials) => {
  try {
    const response = await api.post("/admin/login", credentials);
    localStorage.clear();
    localStorage.setItem("accessToken", response.data.accessToken);
    return response.data;
  } catch (err: any) {
    handleApiError(err, "Admin login failed");
  }
};

export const registerUserAPI = async (userDetails: RegisterUserData) => {
  try {
    await api.post("/register", userDetails);
    return { message: "Please check your email", email: userDetails.email };
  } catch (err: any) {
    handleApiError(err, "User registration failed");
  }
};

export const verifyOtpAPI = async (credentials: Otp) => {
  try {
    const response = await api.post("/verify-otp", credentials);
    localStorage.clear();
    localStorage.setItem("accessToken", response.data.accessToken);
    return response.data;
  } catch (err: any) {
    handleApiError(err, "OTP verification failed");
  }
};

export const fetchUserAPI = async (email: string) => {
  try {
    const response = await api.get("/user", {
      params: { email },
    });
    return response.data;
  } catch (err: any) {
    handleApiError(err, "Failed to fetch user");
  }
};

export const fetchAdminAPI = async (email: string) => {
  try {
    const response = await api.get("/admin/get-admin", {
      params: { email },
    });
    return response.data;
  } catch (err: any) {
    handleApiError(err, "Failed to fetch admin");
  }
};

export const logoutUser = async () => {
  try {
    const response = await api.post("/logout");
    return response;
  } catch (err: any) {
    handleApiError(err, "Logout failed");
  }
};

export const logoutAdmin = async () => {
  try {
    const response = await api.post("/admin/logout");
    return response;
  } catch (err: any) {
    handleApiError(err, "Admin logout failed");
  }
};
