import mongoose, { Document, Schema } from 'mongoose';

export interface ITag extends Document {
  name: string;
  created_at?: Date;
  edited_at?: Date;
}

const tagSchema = new Schema<ITag>({
  name: { type: String, required: true, unique: true }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'edited_at' }
});

export const TagModel = mongoose.model<ITag>('Tag', tagSchema);
