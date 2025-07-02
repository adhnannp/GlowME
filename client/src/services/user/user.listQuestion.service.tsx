import { handleApiError } from '@/utils/errorHandling';
import api from '@/utils/axios';
import { AxiosError } from 'axios';
import { USER_API } from '@/config/userApi';
import { Question } from '@/interfaces/user.questions.interface';

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

export const getOneBySlug = async(slug:string): Promise<Question> =>{
  try {
    const response = await api.get(`${USER_API.FETCH_ONE_BY_SLUG}/${slug}`)
    return response.data.question;
  } catch (error) {
    const err = handleApiError(error as AxiosError | Error, 'Failed to fetch Question');
    throw err;
  }
}