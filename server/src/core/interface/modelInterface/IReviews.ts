import { Document, Schema, Types } from 'mongoose';

export interface IReviews extends Document {
  _id: Types.ObjectId;
  vendor: string;
  packageId:string;
  userId: string;
  rating: number;
  comment: string;
}
