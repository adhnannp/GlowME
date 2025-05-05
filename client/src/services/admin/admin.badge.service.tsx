import api from "@/utils/axios";
import { ADMIN_API } from "@/config/adminApi";
import dataURLtoFile from "@/lib/dataURLtoFile";
import { Badge } from "@/components/admin/badges/BadgeTable";
import { AxiosError } from "axios";
import { handleApiError } from "@/utils/errorHandling";

export const fetchBadges = async (): Promise<Badge[]> => {
  try {
    const response = await api.get(ADMIN_API.GET_BADGE);
    return response.data.badges;
  } catch (err) {
    const error = handleApiError(err as AxiosError | Error, "Failed to fetch badges");
    console.error("Failed to fetch badges:", err);
    throw error;
  }
};

export const addBadge = async (
  newBadge: Omit<Badge, "_id" | "created_at" | "edited_at" | "isListed">
): Promise<Badge> => {
  try {
    const formData = new FormData();
    formData.append("name", newBadge.name);
    formData.append("requiredXp", newBadge.requiredXp.toString());

    if (typeof newBadge.image === "string" && newBadge.image.startsWith("data:")) {
      const file = dataURLtoFile(newBadge.image, "badge.jpg");
      formData.append("image", file);
    } else {
      throw new Error("Invalid image format");
    }

    const response = await api.post(ADMIN_API.ADD_BADGE, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.badge;
  } catch (err) {
    const error = handleApiError(err as AxiosError | Error, "Failed to add badge");
    console.error("Failed to add badge:", err);
    throw error;
  }
};

export const updateBadge = async (updatedBadge: Badge): Promise<Badge> => {
  try {
    const formData = new FormData();
    formData.append("name", updatedBadge.name);
    formData.append("requiredXp", updatedBadge.requiredXp.toString());
    if (typeof updatedBadge.image === "string" && updatedBadge.image.startsWith("data:")) {
      const file = dataURLtoFile(updatedBadge.image, "badge.jpg");
      formData.append("image", file);
    } else if (typeof updatedBadge.image === "string") {
      formData.append("imageUrl", updatedBadge.image);
    }

    const response = await api.patch(`${ADMIN_API.EDIT_BADGE}${updatedBadge._id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.badge;
  } catch (err) {
    const error = handleApiError(err as AxiosError | Error, "Failed to update badge");
    console.error("Failed to update badge:", err);
    throw error;
  }
};

export const listBadge = async (badgeId: string): Promise<Badge> => {
  try {
    const response = await api.patch(`${ADMIN_API.LIST_BADGE}${badgeId}`);
    return response.data.badge;
  } catch (err) {
    const error = handleApiError(err as AxiosError | Error, "Failed to list badge");
    console.error("Failed to list badge:", err);
    throw error;
  }
};

export const unlistBadge = async (badgeId: string): Promise<Badge> => {
  try {
    const response = await api.patch(`${ADMIN_API.UNLIST_BADGE}${badgeId}`);
    return response.data.badge;
  } catch (err) {
    const error = handleApiError(err as AxiosError | Error, "Failed to unlist badge");
    console.error("Failed to unlist badge:", err);
    throw error;
  }
};