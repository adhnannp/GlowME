import { IQuestion } from "../../../../models/Question";

export interface IUserQuestionService {
    checkTitleAvailablity(title:string) : Promise<boolean>;
    createQuestion(data: {title: string;problemDetails: string;tags: string[];isBounty: boolean;bountyCoins:number;createdBy:string;imageUrl?: string;documentUrl?: string;}): Promise<void>;
    uploadToCloudinary(file: Express.Multer.File): Promise<string>;
    uploadToS3(file: Express.Multer.File): Promise<string>;
    listQuestionsByType(type: string,page: number,limit: number): Promise<[IQuestion[],number]>;
    getQuestionBySlug(slug:string):Promise<IQuestion|null>
}