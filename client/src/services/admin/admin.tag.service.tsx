// src/services/tagService.ts
import api from "@/utils/axios";
import { ADMIN_API } from "@/config/adminApi";
import { handleApiError } from "@/utils/errorHandling";
import { AxiosError } from "axios";

export interface Tag {
  _id: string;
  name: string;
  isListed: boolean;
  created_at: Date;
  edited_at?: Date;
}

export const fetchTags = async (): Promise<Tag[]> => {
  try {
    const response = await api.get(ADMIN_API.GET_TAG);
    return response.data.tags;
  } catch (err) {
    const error = handleApiError(err as AxiosError | Error, "Failed to fetch tags");
    console.error("Failed to fetch tags:", err);
    throw error;
  }
};

export const addTag = async (
  newTag: Omit<Tag, "_id" | "isListed" | "created_at" | "edited_at">
): Promise<Tag> => {
  try {
    const response = await api.post(ADMIN_API.ADD_TAG, newTag);
    return response.data.tag;
  } catch (err) {
    const error = handleApiError(err as AxiosError | Error, "Failed to add tag");
    console.error("Failed to add tag:", err);
    throw error;
  }
};

export const updateTag = async (
  updatedTag: Omit<Tag, "isListed" | "created_at" | "edited_at"> & { _id: string }
): Promise<Tag> => {
  try {
    const response = await api.patch(`${ADMIN_API.EDIT_TAG}/${updatedTag._id}`, updatedTag);
    return response.data.tag;
  } catch (err) {
    const error = handleApiError(err as AxiosError | Error, "Failed to update tag");
    console.error("Failed to update tag:", err);
    throw error;
  }
};

export const listTag = async (tagId: string): Promise<Tag> => {
  try {
    const response = await api.patch(`${ADMIN_API.LIST_TAG}/${tagId}`);
    return response.data.tag;
  } catch (err) {
    const error = handleApiError(err as AxiosError | Error, "Failed to list tag");
    console.error("Failed to list tag:", err);
    throw error;
  }
};

export const unlistTag = async (tagId: string): Promise<Tag> => {
  try {
    const response = await api.patch(`${ADMIN_API.UNLIST_TAG}/${tagId}`);
    return response.data.tag;
  } catch (err) {
    const error = handleApiError(err as AxiosError | Error, "Failed to unlist tag");
    console.error("Failed to unlist tag:", err);
    throw error;
  }
};