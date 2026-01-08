import { Document, Types } from 'mongoose';

export interface IReviews extends Document {
  _id: Types.ObjectId;
  vendor: string;
  orderId:string;
  productId:string;
  userId: string;
  replay:string;
  isReplayed:boolean,
  rating: number;
  comment: string;
  createdAt:Date;
}
