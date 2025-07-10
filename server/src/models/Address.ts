import { Schema, model, Document, Types } from 'mongoose';

export interface IAddress extends Document {
  user_id: Types.ObjectId;
  name: string;
  phone: string;
  pincode: string;
  landmark?: string;
  state: string;
  country: string;
  address: string;
  created_at: Date;
  edited_at: Date;
}

const AddressSchema = new Schema<IAddress>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    pincode: { type: String, required: true },
    landmark: { type: String },
    state: { type: String, required: true },
    country: { type: String, required: true },
    address: { type: String, required: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'edited_at' }
  }
);

export const Address = model<IAddress>('Address', AddressSchema);
