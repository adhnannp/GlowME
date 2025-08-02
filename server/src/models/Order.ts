import { Schema, model, Document, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type OrderStatus =
  | 'pending'
  | 'packed'
  | 'shipped'
  | 'delivered'
  | 'canceled';

interface IRawAddress {
  name: string;
  phone: string;
  pincode: string;
  landmark?: string;
  state?: string;
  country: string;
  address: string;
}

export interface IOrder extends Document {
  orderId?: string;
  user_id: Types.ObjectId;
  reward_id: Types.ObjectId;
  paid_coin: number;
  address: IRawAddress;
  status?: OrderStatus
  created_at?: Date;
  edited_at?: Date;
}

const RawAddressSchema = new Schema<IRawAddress>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    pincode: { type: String, required: true },
    landmark: { type: String, required: false },
    state: { type: String, required: false },
    country: { type: String, required: true },
    address: { type: String, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: false, unique: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reward_id: { type: Schema.Types.ObjectId, ref: 'Reward', required: true },
    paid_coin: { type:Number , required:true },
    address: { type: RawAddressSchema, required: true },
    status: {
      type: String,
      enum: [
        'pending',
        'packed',
        'shipped',
        'delivered',
        'canceled',
      ],
      default: 'pending',
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'edited_at' }
  }
);


OrderSchema.pre<IOrder>('save', function (next) {
  if (!this.orderId) {
    this.orderId = `ORD-${uuidv4()}`;
  }
  next();
});

export const Order = model<IOrder>('Order', OrderSchema);
