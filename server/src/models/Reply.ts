import mongoose, { Document, Schema } from 'mongoose';

export interface IReply extends Document {
  answer_id: string | mongoose.Types.ObjectId;
  user_id: string | mongoose.Types.ObjectId;
  reply_text: string;
  created_at?: Date;
  edited_at?: Date;
}

const replySchema = new Schema<IReply>({
  answer_id: { type: Schema.Types.ObjectId, ref: 'Answer', required: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reply_text: { type: String, required: true },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'edited_at' }
});

export const ReplyModel = mongoose.model<IReply>('Reply', replySchema);
