import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import { IQuestionRepository } from '../../core/interfaces/repositories/IQuestionRepository';
import { IUserQuestionService } from '../../core/interfaces/services/user/IUser.Question.Service';
import { IQuestion } from '../../models/Question';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { s3 } from '../../config/s3Client';
import cloudinary from '../../config/cloudinary';
import { Readable } from 'stream';
import { Types } from 'mongoose';
import slugify from 'slugify';
import { cosineSimilarity, generateEmbedding } from '../../utils/generateEmbedding';

@injectable()
export class UserQuestionService implements IUserQuestionService{
  private s3Client = s3;
  constructor(
    @inject(TYPES.QuestionRepository) private questionRepo: IQuestionRepository,
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
  }

  async listQuestionsByType(type: string,page: number,limit: number): Promise<[IQuestion[],number]> {
    const skip = (page - 1) * limit;
    const total = await this.questionRepo.countByType(type);
    const questions = await this.questionRepo.findQuestionsByType(type, skip, limit);
    return [questions,total]
  }

  async getQuestionBySlug(slug:string):Promise<IQuestion|null>{
    const question = this.questionRepo.getQuestionBySlug(slug);
    if(!question){
      throw new Error ('cannot find appropreate Question');
    }
    return question;
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

}