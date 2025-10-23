import { Document, Schema, Types } from 'mongoose';

export interface IPackage extends Document {
  _id: Types.ObjectId;
  Title: string;
  Duration: string;
  Price: number;
  Description: string;
  hotels: {
    Description: string;
    Image: string;
    Name: string;
    id:Types.ObjectId;
  }[];
  Discoveries: string[];
  dining: {
    Cuisine: string;
    Image: string;
    Name: string;
  }[];
  AvailableFoods: string[];
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