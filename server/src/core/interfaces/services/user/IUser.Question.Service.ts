import { IQuestion } from "../../../../models/Question";
import { QuestionWithVotes } from "../../../types/question";

export interface IUserQuestionService {
    checkTitleAvailablity(title:string) : Promise<boolean>;
    createQuestion(data: {title: string;problemDetails: string;tags: string[];isBounty: boolean;bountyCoins:number;createdBy:string;imageUrl?: string;documentUrl?: string;}): Promise<void>;
    uploadToCloudinary(file: Express.Multer.File): Promise<string>;
    uploadToS3(file: Express.Multer.File): Promise<string>;
    listQuestionsByType(type: string,page: number,limit: number,tagId?:string): Promise<[IQuestion[],number]>;
    getQuestionBySlug(slug:string,userId:string):Promise<QuestionWithVotes>
    getSimilarQuestions(queryText: string): Promise<IQuestion[]>;
    getRelatedQuestion(slug:string):Promise<IQuestion[]>;
     reactToQuestion(questionId: string, userId: string, type: 'upvote' | 'devote'): Promise<void>;
    removeQuestionReaction(questionId: string, userId: string): Promise<void>;
}