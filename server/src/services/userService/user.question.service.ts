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

@injectable()
export class UserQuestionService implements IUserQuestionService{
  private s3Client = s3;
  constructor(
    @inject(TYPES.QuestionRepository) private questionRepo: IQuestionRepository,
  ) {}

  async checkTitleAvailablity(title:string) : Promise<boolean>{
    const question = await this.questionRepo.getQuestionByTitle(title)
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
    const convertedTags = data.tags.map((tag) => new Types.ObjectId(tag));
    const slug = slugify(data.title, { lower: true, strict: true });
    await this.questionRepo.create({
      title: data.title,
      slug,
      description: data.problemDetails,
      header_image: data.imageUrl,
      document: data.documentUrl,
      bounty_coin: data.bountyCoins,
      createdBy: data.createdBy,
      tags: convertedTags,
    });
  }

}