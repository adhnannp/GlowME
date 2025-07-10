export type AnswerQuality = 'good' | 'correct' | 'ordinary';

export interface IAnswer {
  _id: string;
  question_id: string;
  user_id: string;
  answer: string;
  quality?: AnswerQuality;
  created_at?: string;
  edited_at?: string;
}
