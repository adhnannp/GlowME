import api from "@/utils/axios";
import { UserCredentials, RegisterUserData } from "@/interfaces/auth.interface";

export const loginUserAPI = async (credentials: UserCredentials) => {
  console.log(credentials)
  const response = await api.post("/login", credentials);
  localStorage.setItem("authToken", response.data.token);
  return response.data;
};

export const loginAdminAPI = async (credentials: UserCredentials) => {
  const response = await api.post("/admin/login", credentials);
  localStorage.setItem("authToken", response.data.token);
  return response.data;
};

export const registerUserAPI = async (userDetails: RegisterUserData) => {
  await api.post("/register", userDetails);
  return loginUserAPI({ email: userDetails.email, password: userDetails.password });
};

export const fetchUserAPI = async () => {
  const response = await api.get("/user");
  return response.data;
};