import { Document, Types } from 'mongoose';

export interface IWallet extends Document {
  _id: Types.ObjectId;
  UserId: Types.ObjectId | string;
  role: string,
  Transaction: {
    Type: string
    Amount: number
    Description: string
    paymentIntentId?: string
    Date: Date,
    orderId?: string
  }[];
  Balance: number
}