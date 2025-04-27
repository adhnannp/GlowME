import api from "@/utils/axios";
import { USER_API } from "@/config/userApi";
import { AxiosError } from "axios";
import { Badge } from "@/components/admin/badges/BadgeTable";
import { User } from "@/interfaces/auth.interface";
import { handleApiError } from "@/utils/errorHandling";

export const fetchNonAcquiredBadges = async (userId: string): Promise<Badge[]> => {
  try {
    const response = await api.get(`${USER_API.GET_BADGES}/${userId}`);
    if (!response.data.badges) {
      throw new Error("No badges found in response");
    }
    return response.data.badges;
  } catch (err) {
    throw handleApiError(err as AxiosError | Error, "Failed to fetch non-acquired badges");
  }
};

export const fetchUserBadges = async (userId: string): Promise<{
  acquiredBadges: Badge[];
  currentBadge: Badge | null;
}> => {
  try {
    const response = await api.get(`${USER_API.GET_USER_BADGES}/${userId}`);
    if (!response.data.badges) {
      throw new Error("No user badges found in response");
    }
    return {
      acquiredBadges: response.data.badges.badges.map((b: any) => b.badgeId),
      currentBadge: response.data.badges.currentBadge || null,
    };
  } catch (err) {
    throw handleApiError(err as AxiosError | Error, "Failed to fetch user badges");
  }
};

export const unlockBadge = async (badgeId: string): Promise<User> => {
  try {
    if (!badgeId) {
      throw new Error("Badge ID is required");
    }
    const response = await api.patch(USER_API.UNLOCK_BADGE, { badgeId });
    if (!response.data.user) {
      throw new Error("No user data in response");
    }
    return response.data.user;
  } catch (err) {
    throw handleApiError(err as AxiosError | Error, "Failed to unlock badge");
  }
};

export const setCurrentBadge = async (badgeId: string): Promise<User> => {
  try {
    if ( !badgeId) {
      throw new Error("Badge ID is required");
    }
    const response = await api.put(USER_API.SET_CURRENT_BADGE, { badgeId });
    if (!response.data.user) {
      throw new Error("No user data in response");
    }
    return response.data.user;
  } catch (err) {
    throw handleApiError(err as AxiosError | Error, "Failed to set current badge");
  }
};