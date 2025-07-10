import { handleApiError } from '@/utils/errorHandling';
import api from '@/utils/axios';
import { AxiosError } from 'axios';
import { UserWithBadge } from '@/interfaces/auth.interface';
import { USER_API } from '@/config/userApi';

export interface Answer {
  _id: string;
  answer: string;
  quality: 'ordinary' | 'good' | 'correct';
  user: UserWithBadge;
  voteScore: number;
  totalReactions: number;
  userReaction?: 'upvote' | 'devote';
  replyCount: number;
}

interface CanAnswerResponse {
  canAnswer: boolean;
  alreadyAnswered: boolean;
}

interface AnswersResponse {
  answers: Answer[];
  total: number;
  page: number;
  limit: number;
  message: string;
}

interface CreateAnswerData {
  question_id: string;
  answer: string;
}

interface ReactAnswerData {
  type: 'upvote' | 'devote';
}

interface UpdateQualityData {
  quality: 'ordinary' | 'good' | 'correct';
}

export const createAnswer = async (data: CreateAnswerData): Promise<any> => {
  try {
    const response = await api.post(USER_API.ADD_ANSWER, data);
    return response.data;
  } catch (error) {
    const err = handleApiError(error as AxiosError | Error, 'Failed to create answer');
    throw err;
  }
};

export const canUserAnswer = async (questionId: string): Promise<CanAnswerResponse> => {
  try {
    const response = await api.get(`${USER_API.CAN_USER_ANSWER}/${questionId}`);
    return response.data;
  } catch (error) {
    const err = handleApiError(error as AxiosError | Error, 'Failed to check if user can answer');
    throw err;
  }
};

export const fetchAnswersByQuestion = async (
  questionId: string,
  page: number = 1,
  limit: number = 10
): Promise<AnswersResponse> => {
  try {
    const response = await api.get(`${USER_API.LIST_ANSWER}/${questionId}`, {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    const err = handleApiError(error as AxiosError | Error, 'Failed to fetch answers');
    throw err;
  }
};

export const reactToAnswer = async (answerId: string, data: ReactAnswerData): Promise<any> => {
  try {
    const response = await api.post(`${USER_API.ANSWER_REACT}/${answerId}`, data);
    return response.data;
  } catch (error) {
    const err = handleApiError(error as AxiosError | Error, 'Failed to react to answer');
    throw err;
  }
};

export const removeAnswerReaction = async (answerId: string): Promise<any> => {
  try {
    const response = await api.delete(`${USER_API.ANSWER_REACT}/${answerId}`);
    return response.data;
  } catch (error) {
    const err = handleApiError(error as AxiosError | Error, 'Failed to remove answer reaction');
    throw err;
  }
};

export const updateAnswerQuality = async (answerId: string, data: UpdateQualityData): Promise<any> => {
  try {
    const response = await api.patch(`${USER_API.ANSWER_UPDATE_QUALITY}/${answerId}`, data);
    return response.data;
  } catch (error) {
    const err = handleApiError(error as AxiosError | Error, 'Failed to update answer quality');
    throw err;
  }
};