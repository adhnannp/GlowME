// src/services/tagService.ts
import api from "@/utils/axios";
import { ADMIN_API } from "@/config/adminApi";
import { handleApiError } from "@/utils/errorHandling";
import { AxiosError } from "axios";
import { tagNameSchema } from "@/validations/tag/tagValidation";

export interface Tag {
  _id: string;
  name: string;
  isListed: boolean;
  created_at: Date;
  edited_at?: Date;
}

export const fetchTags = async (page: number, limit: number, searchQuery: string): Promise<{ tags: Tag[], pagination: { totalItems: number, totalPages: number, currentPage: number, perPage: number, hasNextPage: boolean, hasPrevPage: boolean } }> => {
  try {
    const query = `page=${page}&limit=${limit}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ""}`;
    const response = await api.get(`${ADMIN_API.GET_TAG}?${query}`);
    return response.data;
  } catch (err) {
    const error = handleApiError(err as AxiosError | Error, "Failed to fetch tags");
    throw error;
  }
};

export const addTag = async (
  newTag: Omit<Tag, "_id" | "isListed" | "created_at" | "edited_at">
): Promise<Tag> => {
  const result = tagNameSchema.safeParse(newTag.name);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  try {
    const response = await api.post(ADMIN_API.ADD_TAG, newTag);
    return response.data.tag;
  } catch (err) {
    const error = handleApiError(err as AxiosError | Error, "Failed to add tag");
    throw error;
  }
};

export const updateTag = async (
  updatedTag: Omit<Tag, "isListed" | "created_at" | "edited_at"> & { _id: string }
): Promise<Tag> => {
  const result = tagNameSchema.safeParse(updatedTag.name);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  try {
    const response = await api.patch(`${ADMIN_API.EDIT_TAG}/${updatedTag._id}`, updatedTag);
    return response.data.tag;
  } catch (err) {
    const error = handleApiError(err as AxiosError | Error, "Failed to update tag");
    throw error;
  }
};

export const listTag = async (tagId: string): Promise<Tag> => {
  try {
    const response = await api.patch(`${ADMIN_API.LIST_TAG}/${tagId}`);
    return response.data.tag;
  } catch (err) {
    const error = handleApiError(err as AxiosError | Error, "Failed to list tag");
    throw error;
  }
};

export const unlistTag = async (tagId: string): Promise<Tag> => {
  try {
    const response = await api.patch(`${ADMIN_API.UNLIST_TAG}/${tagId}`);
    return response.data.tag;
  } catch (err) {
    const error = handleApiError(err as AxiosError | Error, "Failed to unlist tag");
    throw error;
  }
};