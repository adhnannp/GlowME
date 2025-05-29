import { handleApiError } from '@/utils/errorHandling';
import api from '@/utils/axios';
import { AxiosError } from 'axios';
import { USER_API } from '@/config/userApi';
import { Tag } from '@/interfaces/user.tag.interface';

interface TitleAvailabilityResponse {
  isAvailable: boolean;
  message: string;
}

interface SimilarQuestionsResponse {
  similarQuestions: { id: string; title: string; url: string }[];
}

export const fetchTags = async (query: string): Promise<Tag[]> => {
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

export const checkTitleAvailability = async (title: string): Promise<TitleAvailabilityResponse> => {
  try {
    console.log("title",title)
    const response = await api.get(USER_API.CHECK_TITLE, { params: { title: title.trim() } });
    return {
      isAvailable: response.data.isAvailable,
      message: response.data.message,
    };
  } catch (error) {
    const err = handleApiError(error as AxiosError | Error, 'Title availability checking failed. Please try again later.');
    throw err;
  }
};

export const fetchSimilarQuestions = async (title: string): Promise<SimilarQuestionsResponse> => {
  try {
    const response = await api.post(USER_API.CHECK_SIMILAR, { title: title.trim() });
    return {
      similarQuestions: response.data.similarQuestions || [],
    };
  } catch (error) {
    const err = handleApiError(error as AxiosError | Error, 'Failed to fetch similar questions');
    throw err;
  }
};

export const createQuestion = async (data: FormData): Promise<any> => {
  try {
    const response = await api.post('/questions/create', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    const err = handleApiError(error as AxiosError | Error, 'Failed to create question');
    throw err;
  }
};