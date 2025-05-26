import mongoose, { Document, Schema } from 'mongoose';

export interface IReaction extends Document {
  user_id: string | mongoose.Types.ObjectId;
  entity_id: mongoose.Types.ObjectId;
  entity_type: 'question' | 'answer' | 'reply';
  type: 'upvote' | 'devote';
  created_at?: Date;
}

const reactionSchema = new Schema<IReaction>({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  entity_id: { type: Schema.Types.ObjectId, required: true },
  entity_type: { type: String, enum: ['question', 'answer', 'reply'], required: true },
  type: {type:String,enum:['upvote','devote'],required:true },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false }
});

export const ReactionModel = mongoose.model<IReaction>('Reaction', reactionSchema);
