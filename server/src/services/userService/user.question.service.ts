import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import { IQuestionRepository } from '../../core/interfaces/repositories/IQuestionRepository';
import { IUserQuestionService } from '../../core/interfaces/services/user/IUser.Question.Service';
import { IQuestion } from '../../models/Question';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { s3 } from '../../config/s3Client';
import cloudinary from '../../config/cloudinary';
import { Readable } from 'stream';
import mongoose, { Types } from 'mongoose';
import slugify from 'slugify';
import { cosineSimilarity, generateEmbedding } from '../../utils/generateEmbedding';
import IReactionRepository from '../../core/interfaces/repositories/IReactionRepository';
import { QuestionWithVotes } from '../../core/types/question';
import logger from '../../utils/logger';
import { IUserRepository } from '../../core/interfaces/repositories/IUserRepository';
import { IAnswerRepository } from '../../core/interfaces/repositories/IAnswerRepository';

@injectable()
export class UserQuestionService implements IUserQuestionService{
  private s3Client = s3;
  constructor(
    @inject(TYPES.QuestionRepository) private questionRepo: IQuestionRepository,
    @inject(TYPES.ReactionRepository) private reactionRepo: IReactionRepository,
    @inject(TYPES.UserRepository) private userRepo:IUserRepository,
    @inject(TYPES.AnswerRepository) private answerRepo :IAnswerRepository,
  ) {}

  async checkTitleAvailablity(title:string) : Promise<boolean>{
    const question = await this.questionRepo.getQuestionByTitle(title);
    if(!question){
        return true;
    }
    return false;
  }

  async uploadToCloudinary(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder: 'questions' }, (error, result) => {
        if (error) return reject(error);
        resolve(result?.secure_url || '');
      });
      Readable.from(file.buffer).pipe(stream);
    });
  }

  async uploadToS3(file: Express.Multer.File): Promise<string> {
    const key = `documents/${Date.now()}-${file.originalname}`;
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3Client.send(command);
    return `${process.env.AWS_S3_URL}/${key}`;
  }

  async createQuestion(data: {title: string;problemDetails: string;tags: string[];isBounty: boolean;bountyCoins: number;createdBy:string;imageUrl?: string;documentUrl?: string}): Promise<void> {
    const isAvailable = await this.checkTitleAvailablity(data.title);
    if (!isAvailable) {
      throw new Error('A question with this title already exists');
    }
    const type = data.isBounty ? `bounty` : `descriptive`;
    const convertedTags = data.tags.map((tag) => new Types.ObjectId(tag));
    const slug = slugify(data.title, { lower: true, strict: true });
    const embedding = await generateEmbedding(`${data.title} ${data.problemDetails}`);
    const user = await this.userRepo.findById(data.createdBy);

    if (data.isBounty && data.bountyCoins ) {
      if(!user?.coin_balance || user.coin_balance < data.bountyCoins) {
        throw new Error("Insufficient balance");
      }else{
        await this.userRepo.incrementCoin(user._id as string , -data.bountyCoins)
        await this.userRepo.incrementXp(user._id as string ,10)
      }
    }
    await this.userRepo.incrementXp(user?._id as string,5)
    
    await this.questionRepo.create({
      title: data.title,
      slug,
      description: data.problemDetails,
      header_image: data.imageUrl,
      document: data.documentUrl,
      type,
      bounty_coin: data.bountyCoins,
      createdBy: data.createdBy,
      tags: convertedTags,
      embedding,
    });
    return;
  }

  async listQuestionsByType(type: string,page: number,limit: number, tagId?:string): Promise<[IQuestion[],number]> {
    const skip = (page - 1) * limit;
    const total = await this.questionRepo.countByType(type,tagId);
    const questions = await this.questionRepo.findQuestionsByType(type, skip, limit,tagId);
    return [questions,total]
  }

  async getQuestionBySlug(slug:string,userId:string):Promise<QuestionWithVotes>{
    const question = await this.questionRepo.getQuestionBySlug(slug);
    if(!question || !question._id){
      throw new Error ('cannot find appropreate Question');
    }
    const totalVotes = await this.reactionRepo.getVoteScore(question._id.toString(),'question')
    const userReaction = await this.reactionRepo.UserReaction(userId,question._id.toString(),'question')
    const correctAnswer = await this.answerRepo.findOne({
      question_id: question._id,
      quality: 'correct',
    });
    return {question,totalVotes,userReaction,correctAnswer: correctAnswer ?? undefined,};
  }

  async getSimilarQuestions(queryText: string): Promise<IQuestion[]> {
    const threshold = 0.6
    const currentEmbedding = await generateEmbedding(queryText);
    const allQuestions = await this.questionRepo.findAll({ embedding: { $exists: true }});
    const similar: { question: IQuestion; score: number }[] = [];
    for (const question of allQuestions) {
      const similarity = cosineSimilarity(currentEmbedding, question.embedding);
      if (similarity >= threshold) {
        similar.push({ question, score: similarity });
      }
    }
    return similar
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map((s) => s.question);
  }

  async getRelatedQuestion(questionId:string):Promise<IQuestion[]> {
    const threshold = 0.6
    const currentQuestion = await this.questionRepo.findById(questionId)
    if(!currentQuestion){
      throw new Error('No question provided')
    }
    const allQuestions = await this.questionRepo.findAll({ embedding: { $exists: true },slug:{$ne:currentQuestion.slug}});
    const similar: { question: IQuestion; score: number }[] = [];
    for (const question of allQuestions) {
      const similarity = cosineSimilarity(currentQuestion.embedding, question.embedding);
      if (similarity >= threshold) {
        similar.push({ question, score: similarity });
      }
    }
    return similar
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map((s) => s.question);
  }

  async reactToQuestion(questionId: string, userId: string, type: 'upvote' | 'devote'): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(questionId)) throw new Error("Invalid question ID");
    const existingReaction = await this.reactionRepo.findOne({
      entity_id: questionId,
      user_id: userId,
      entity_type: 'question',
    });

    if (existingReaction) {
      if (existingReaction.type === type) return;
      await this.reactionRepo.update((existingReaction._id as  mongoose.Types.ObjectId).toString(), { type });
    } else {
      await this.reactionRepo.create({
        entity_id: new mongoose.Types.ObjectId(questionId),
        user_id: new mongoose.Types.ObjectId(userId),
        entity_type: 'question',
        type,
      });
    }
  }

  async removeQuestionReaction(questionId: string, userId: string): Promise<void> {
    await this.reactionRepo.deleteOne({
      entity_id: new mongoose.Types.ObjectId(questionId),
      user_id: new mongoose.Types.ObjectId(userId),
      entity_type: 'question',
    });
  }

}