import { User } from "./auth.interface";

export interface ConnectionNotification {
  _id: string;
  user: string;
  type: 'follow' | 'report' | 'system';
  message: string;
  related_user?: User; 
  is_read: boolean;
  created_at: Date;
}