import api from "@/utils/axios";
import { UserCredentials, RegisterUserData, Otp } from "@/interfaces/auth.interface";

export const loginUserAPI = async (credentials: UserCredentials) => {
  const response = await api.post("/login", credentials);
  localStorage.clear()
  localStorage.setItem("accessToken", response.data.accessToken);
  return response.data;
};

export const loginAdminAPI = async (credentials: UserCredentials) => {
  const response = await api.post("/admin/login", credentials);
  localStorage.clear()
  localStorage.setItem("accessToken", response.data.accessToken);
  return response.data;
};

export const registerUserAPI = async (userDetails: RegisterUserData) => {
  await api.post("/register", userDetails);
  return { message: "Please check your email", email: userDetails.email };
};

export const verifyOtpAPI = async (credentials: Otp) => {
  const response = await api.post("/verify-otp", credentials);
  localStorage.clear()
  localStorage.setItem("accessToken", response.data.accessToken);
  return response.data;
};

export const fetchUserAPI = async (email:string) => {
  const response = await api.get("/user", {
    params: { email },
  });
  return response.data;
};

export const logoutUser = async()=>{
  const response = await api.post("/logout")
  return response
}
