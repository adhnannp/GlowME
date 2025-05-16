import api from "@/utils/axios";
import { ApiResponse } from "@/interfaces/admin.report.interface";
import { toast } from "react-hot-toast";
import { ADMIN_API } from "@/config/adminApi";

export const fetchReports = async (): Promise<ApiResponse> => {
  try {
    const response = await api.get<ApiResponse>(ADMIN_API.GET_USER_REPORT);
    return response.data;
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw error;
  }
};

export const banUser = async (userId: string): Promise<void> => {
  try {
    await api.patch(`${ADMIN_API.BAN_USER_REPORT}/${userId}`);
    toast.success("Banned successfully");
  } catch (error) {
    console.error("Error banning user:", error);
    toast.error("Failed to ban user");
    throw error;
  }
};

export const rejectReport = async (reportId: string): Promise<void> => {
  try {
    await api.patch(`${ADMIN_API.REJECT_USER_REPORT}/${reportId}`);
    toast.success("Report rejected successfully");
  } catch (error) {
    console.error("Error rejecting report:", error);
    toast.error("Failed to reject report");
    throw error;
  }
};


export const rejectAllReports = async (userId: string): Promise<void> => {
  try {
    await api.patch(`${ADMIN_API.REJECT_ALL_USER_REPORT}/${userId}`)
    toast.success("All pending reports rejected");
  } catch (error) {
    console.error("Error rejecting all reports:", error);
    toast.error("Failed to reject all reports");
    throw error;
  }
};

export const sendWarning = async (reportId: string): Promise<void> => {
  try {
    await api.post(`${ADMIN_API.WARNING_USER_REPORT}/${reportId}`);
    toast.success("Warning sent successfully");
  } catch (error) {
    console.error("Error sending warning:", error);
    toast.error("Failed to send warning");
    throw error;
  }
};