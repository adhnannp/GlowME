import axios from "axios";
import {store} from "@/store/store";
import { logout } from "@/feature/authThunks";
import { disconnectSocket } from "./socket";
import { clearNotifications } from "@/feature/socketSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials:true,
});


let isRefreshing = false;
type QueuedRequest = {
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
};

let failedRequestsQueue: QueuedRequest[] = [];

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if(error.response.status === 400 && error.response.data.message === 'User invalid or banned'){
        store.dispatch(logout());
        store.dispatch(clearNotifications());
        disconnectSocket();
        window.location.href = "/login";
        return;
    }
    if (error.response?.status === 403 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await axios.post(
          import.meta.env.VITE_REFRESH_TOKEN_URL,
          {},
          { withCredentials: true }
        );

        const { accessToken } = refreshResponse.data;
        localStorage.setItem("accessToken", accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        failedRequestsQueue.forEach((promise) => promise.resolve(api(originalRequest)));
        failedRequestsQueue = [];

        return api(originalRequest);
      } catch (refreshError) {
        const isAdminRoute = originalRequest.url?.startsWith("/admin");

        store.dispatch(logout());
        store.dispatch(clearNotifications());
        disconnectSocket();
        localStorage.removeItem("accessToken");

        window.location.href = isAdminRoute ? "/admin/login" : "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;