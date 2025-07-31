import { Reward } from "@/components/admin/Reward/RewardTable";
import { User } from "./auth.interface";

export interface IRawAddress {
  name: string;
  phone: string;
  pincode: string;
  landmark?: string;
  state?: string;
  country: string;
  address: string;
}

export default interface IOrder {
  _id:string;
  orderId: string;
  user_id: string;
  reward_id: string;
  paid_coin: number;
  address: IRawAddress;
  status: string;
  created_at: Date;
  edited_at: Date;
}

export interface IOrderWithProduct {
  _id:string;
  orderId: string;
  user_id: string;
  reward_id: Reward;
  paid_coin: number;
  address: IRawAddress;
  status: string;
  created_at: Date;
  edited_at: Date;
}

export interface IOrderFull{
  _id:string;
  orderId: string;
  user_id: User;
  reward_id: Reward;
  paid_coin: number;
  address: IRawAddress;
  status: string;
  created_at: Date;
  edited_at: Date;
}