import { handleApiError } from '@/utils/errorHandling';
import api from '@/utils/axios';
import { AxiosError } from 'axios';
import { USER_API } from '@/config/userApi';
import { Tag } from '@/interfaces/user.tag.interface';

export const searchTag = async (query: string): Promise<Tag[]> => {
  try {
    const response = await api.get(USER_API.SEARCH_TAGS, {
      params: { query: query.trim() },
    });
    if (!Array.isArray(response.data.tags) || response.data.tags.length === 0) {
      return [];
    }
    return response.data.tags;
  } catch (error) {
    const err = handleApiError(error as AxiosError | Error, 'Failed to fetch tags');
    throw err;
  }
};

export const fetchTopTags = async (): Promise<Tag[]> => {
  try {
    const response = await api.get(USER_API.GET_TOP_TAGS);
    if (!Array.isArray(response.data.topTags) || response.data.topTags.length === 0) {
      return [];
    }
    return response.data.topTags;
  } catch (error) {
    const err = handleApiError(error as AxiosError | Error, 'Failed to fetch tags');
    throw err;
  }
};
