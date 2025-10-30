import { Document, Schema, Types } from 'mongoose';

export interface IPackage extends Document {
  _id: Types.ObjectId;
  title: string;
  duration: string;
  price: number;
  description: string;
  hotels: string[];
  discoveries: string[];
  dining: string[];
  availableFoods: string[];
  itinerary: {
    Activities: string[];
    Day: number;
    Title: string;
  }[];
  reviews: {
    Comment: string;
    Date: Date;
    Rating: number;
    UserName: string;
  }[];
  CreatedBy: Date;
}
