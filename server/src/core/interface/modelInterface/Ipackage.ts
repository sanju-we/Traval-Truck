import { Document, Types } from 'mongoose';

export interface IPackage extends Document {
  _id: Types.ObjectId;
  title: string;
  duration: string;
  price: number;
  maxPeople:number;
  description: string;
  discoveries: string[];
  availableFoods: string[];
  itinerary: {
    activities: string[];
    day: number;
    title: string;
  }[];
  reviews: {
    Comment: string;
    Date: Date;
    Rating: number;
    UserName: string;
  }[];
  CreatedBy: Date;
  images:string[];
  ownedBy:string;
}
