import mongoose, { Document, Schema } from 'mongoose';

export type AnswerQuality = 'good' | 'correct' | 'ordinary';

export interface IAnswer extends Document {
  question_id: string | mongoose.Types.ObjectId;
  user_id: string | mongoose.Types.ObjectId;
  answer: string;
  quality?: AnswerQuality;
  created_at?: Date;
  edited_at?: Date;
}

const answerSchema = new Schema<IAnswer>({
  question_id: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  answer: { type: String, required: true },
  quality: {
    type: String,
    enum: ['good', 'correct', 'ordinary'],
    default: 'ordinary'
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'edited_at' }
});

export const AnswerModel = mongoose.model<IAnswer>('Answer', answerSchema);