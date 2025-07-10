import { Schema, model, Document, Types } from 'mongoose';

interface IRawAddress {
  name: string;
  phone: string;
  pincode: string;
  landmark?: string;
  state: string;
  country: string;
  address: string;
}

export interface IOrder extends Document {
  user_id: Types.ObjectId;
  reward_id: Types.ObjectId;
  address: IRawAddress;
  status: 'pending' | 'shipped' | 'delivered' | 'canceled' | 'returned';
  created_at: Date;
  edited_at: Date;
}

const RawAddressSchema = new Schema<IRawAddress>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    pincode: { type: String, required: true },
    landmark: { type: String },
    state: { type: String, required: true },
    country: { type: String, required: true },
    address: { type: String, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reward_id: { type: Schema.Types.ObjectId, ref: 'Reward', required: true },
    address: { type: RawAddressSchema, required: true },
    status: {
      type: String,
      enum: ['pending', 'shipped', 'delivered', 'canceled', 'returned'],
      default: 'pending',
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'edited_at' }
  }
);

export const Order = model<IOrder>('Order', OrderSchema);
