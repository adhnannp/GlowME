import mongoose, { Document } from 'mongoose';

export interface INotification extends Document {
  user: string | mongoose.Types.ObjectId;
  type: 'follow' | 'report' | 'system';
  message: string;
  related_user?: string | mongoose.Types.ObjectId;
  is_read: boolean;
  created_at: Date;
}

const notificationSchema = new mongoose.Schema<INotification>({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['follow', 'report', 'system'], 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  related_user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  is_read: { 
    type: Boolean, 
    default: false 
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  }
});

export const NotificationModel = mongoose.model<INotification>('Notification', notificationSchema);