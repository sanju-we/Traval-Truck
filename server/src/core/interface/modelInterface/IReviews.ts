import { Document, Schema, Types } from 'mongoose';

export interface IReviews extends Document {
  _id: Types.ObjectId;
  vendor: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  rating: number;
  comment: string;
}
