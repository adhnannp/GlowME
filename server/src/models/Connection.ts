import mongoose, { Document } from 'mongoose';

export interface IConnection extends Document {
  follower: string | mongoose.Types.ObjectId;
  following: string | mongoose.Types.ObjectId;
  created_at: Date;
}

const connectionSchema = new mongoose.Schema<IConnection>({
  follower: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  following: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  }
});

connectionSchema.index({ follower: 1, following: 1 }, { unique: true });

export const ConnectionModel = mongoose.model<IConnection>('Connection', connectionSchema);