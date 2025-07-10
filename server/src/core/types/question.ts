import { IAnswer } from "../../models/Answer";
import { IQuestion } from "../../models/Question";

export type QuestionWithVotes = {
  question: IQuestion;
  totalVotes: number;
  userReaction: 'upvote' | 'devote' | null;
  correctAnswer: IAnswer | undefined;
};