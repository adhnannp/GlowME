import mongoose, { Document } from 'mongoose';

export interface IReport extends Document {
  reporter: string | mongoose.Types.ObjectId;
  reported_user: string | mongoose.Types.ObjectId;
  reason: string;
  status: 'pending' | 'resolved' | 'rejected';
  created_at: Date;
}

const reportSchema = new mongoose.Schema<IReport>({
  reporter: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  reported_user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  reason: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'resolved', 'rejected'], 
    default: 'pending' 
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  }
});

export const ReportModel = mongoose.model<IReport>('Report', reportSchema);