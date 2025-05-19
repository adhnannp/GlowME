import api from "@/utils/axios";
import { ApiResponse } from "@/interfaces/admin.report.interface";
import { toast } from "react-hot-toast";
import { ADMIN_API } from "@/config/adminApi";
import { handleApiError } from "@/utils/errorHandling";
import { AxiosError } from "axios";

export const fetchReports = async (): Promise<ApiResponse> => {
  try {
    const response = await api.get<ApiResponse>(ADMIN_API.GET_USER_REPORT);
    return response.data;
  } catch (error) {
    const err = handleApiError(error as AxiosError | Error, 'Error fetching reports');
    throw err;
  }
};

export const banUser = async (userId: string , duration: string): Promise<void> => {
  try {
    await api.patch(`${ADMIN_API.BAN_USER_REPORT}/${userId}`,  { duration } );
    toast.success("Banned successfully");
  } catch (error) {
    toast.error("Failed to ban user");
    const err = handleApiError(error as AxiosError | Error, 'Failed to ban user');
    throw err;
  }
};

export const rejectReport = async (reportId: string): Promise<void> => {
  try {
    await api.patch(`${ADMIN_API.REJECT_USER_REPORT}/${reportId}`);
    toast.success("Report rejected successfully");
  } catch (error) {
    toast.error("Failed to reject report");
    const err = handleApiError(error as AxiosError | Error, 'Failed to reject report');
    throw err;
  }
};


export const rejectAllReports = async (userId: string): Promise<void> => {
  try {
    await api.patch(`${ADMIN_API.REJECT_ALL_USER_REPORT}/${userId}`)
    toast.success("All pending reports rejected");
  } catch (error) {
    console.error("Error rejecting all reports:", error);
    toast.error("Failed to reject all reports");
    const err = handleApiError(error as AxiosError | Error, 'Failed to reject all reports');
    throw err;
  }
};

export const sendWarning = async (reportId: string): Promise<void> => {
  try {
    await api.post(`${ADMIN_API.WARNING_USER_REPORT}/${reportId}`);
    toast.success("Warning sent successfully");
  } catch (error) {
    console.error("Error sending warning:", error);
    toast.error("Failed to send warning");
    const err = handleApiError(error as AxiosError | Error, 'Failed to send warning');
    throw err;
  }
};