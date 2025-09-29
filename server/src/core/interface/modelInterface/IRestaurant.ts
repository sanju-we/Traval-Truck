import { Document, Schema, Types } from 'mongoose';

export interface IRestaurant extends Document {
  _id: Types.ObjectId;
  companyName: string;
  address: Schema.Types.ObjectId;
  email: string;
  password: string;
  rating: Number;
  totalReviews: Number;
  cuisines: string[];
  foodItems: Schema.Types.ObjectId;
  reviews: Schema.Types.ObjectId[];
  images: string[];
  phone: number;
  ownerName: string;
  role: string;
  isApproved: boolean;
  isRestricted: boolean;
}
