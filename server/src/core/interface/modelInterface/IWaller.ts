import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IWallet extends Document {
  _id: ObjectId;
  UserId: string;
  role:string,
  Transaction: {
    Type: string
    Amount: number
    Description: string
    paymentIntentId:string
    Date: Date,
    orderId?:string
  }[];
  Balance: number
}