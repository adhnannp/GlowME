import { handleApiError } from '@/utils/errorHandling';
import api from '@/utils/axios';
import { AxiosError } from 'axios';
import { USER_API } from '@/config/userApi';

export const fetchQuestionByType = async (page:number,type:string): Promise<any> => {
  try {
    const response = await api.get(`${USER_API.FETCH_QUESTIONS}?q-type=${type}&page=${page}`)
    if (!Array.isArray(response.data.questions)) {
      return [];
    }
    return response.data;
  } catch (error) {
    const err = handleApiError(error as AxiosError | Error, 'Failed to fetch Questions');
    throw err;
  }
};