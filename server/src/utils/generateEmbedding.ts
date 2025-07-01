import axios, { AxiosError } from 'axios';
import logger from './logger';

const EMBEDDING_API_URL = process.env.EMBEDDING_API_URL;

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await axios.post(`${EMBEDDING_API_URL}`, { text });
    return response.data.embedding;
  } catch (error) {
    const axiosError = error as AxiosError;
    logger.error('Error generating embedding:', {
      message: axiosError.message,
      status: axiosError.response?.status,
      data: axiosError.response?.data,
    });
    throw new Error('Failed to generate embedding Try again later');
  }
}

export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must be of same length to compute cosine similarity');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
