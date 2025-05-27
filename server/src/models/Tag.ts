import mongoose, { Document, Schema } from 'mongoose';

export interface ITag extends Document {
  name: string;
  isListed:boolean;
  created_at?: Date;
  edited_at?: Date;
}

const tagSchema = new Schema<ITag>({
  name: { type: String, required: true, unique: true },
  isListed: { type: Boolean, default: true },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'edited_at' }
});

export const TagModel = mongoose.model<ITag>('Tag', tagSchema);
