import { IQuestion } from "../../models/Question";

export type QuestionWithVotes = {
  question: IQuestion;
  totalVotes: number;
  userReaction: 'upvote' | 'devote' | null;
};