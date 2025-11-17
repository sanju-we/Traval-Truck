import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IWallet extends Document {
  _id: ObjectId;
  UserId: ObjectId
  transacion: {
    Type: string
    Amount: number
    Description: string
    Date: Date
  }[];
  Balance: number
}