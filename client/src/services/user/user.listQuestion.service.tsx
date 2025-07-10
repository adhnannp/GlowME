import { handleApiError } from '@/utils/errorHandling';
import api from '@/utils/axios';
import { AxiosError } from 'axios';
import { USER_API } from '@/config/userApi';
import { Question, SimilarQuestion } from '@/interfaces/user.questions.interface';
import { IAnswer } from '@/interfaces/user.answer.interface';

export const fetchQuestionByType = async (page:number,type:string,tagId?:string): Promise<any> => {
  try {
    const response = await api.get(`${USER_API.FETCH_QUESTIONS}?q-type=${type}&tagId=${tagId}&page=${page}`)
    if (!Array.isArray(response.data.questions)) {
      return [];
    }
    return response.data;
  } catch (error) {
    const err = handleApiError(error as AxiosError | Error, 'Failed to fetch Questions');
    throw err;
  }
};

export interface QuestionResponse {
  question: Question;
  correctAnswer:IAnswer;
  totalVotes: number;
  userReaction: 'upvote' | 'devote' | null;
  message: string;
}

export const getOneBySlug = async(slug:string):Promise<QuestionResponse>=>{
  try {
    const response = await api.get(`${USER_API.FETCH_ONE_BY_SLUG}/${slug}`)
    return response.data;
  } catch (error) {
    const err = handleApiError(error as AxiosError | Error, 'Failed to fetch Question');
    throw err;
  }
}

export const fetchRelatedQuestions = async (id: string): Promise<SimilarQuestion[]> => {
  try {
    const response = await api.get(`${USER_API.RELATED_QUESTIONS}/${id}`);
    return response.data.relatedQuestions;
  } catch (error) {
    const err = handleApiError(error as AxiosError | Error, 'Failed to fetch similar questions');
    throw err;
  }
};

export const reactToQuestion = async (questionId: string,type: 'upvote' | 'devote'): Promise<string> => {
  try {
    const response = await api.post(`${USER_API.REACT_TO_QUESTION}/${questionId}`, { type });
    return response.data.message;
  } catch (error) {
    const err = handleApiError(error as AxiosError | Error, 'Failed to react to question');
    throw err;
  }
};

export const removeQuestionReaction = async (questionId: string): Promise<string> => {
  try {
    const response = await api.delete(`${USER_API.REACT_TO_QUESTION}/${questionId}`);
    return response.data.message;
  } catch (error) {
    const err = handleApiError(error as AxiosError | Error, 'Failed to remove reaction');
    throw err;
  }
};
