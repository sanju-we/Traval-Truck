import { Schema, model } from 'mongoose';
import { IPackage } from '../core/interface/modelInterface/Ipackage.js';
import { string } from 'zod';

export const dining = {
  Cuisines: String,
  Image: String,
  Name: String
}
export const itinerary = {
  Activities: [String],
  Day: Number,
  Titile: String
}
export const reviews = {
  Comment: String,
  Date: Date,
  Rating: Number,
  userID: String
}

const packageSchema = new Schema<IPackage>({
  Title: {
    type: String,
    required: true,
  },
  Duration: {
    type: String,
    required: true,
  },
  Price: {
    type: Number,
    required: true,
  },
  Description: {
    type: String,
  },
  hotels: {
    Description: { type: String },
    image: { type: String },
    Name: { type: String },
    id: { type: String, Ref: 'Partner' }
  },
  Discoveries: {
    type: [String],
  },
  dining: { type: [dining] },
  AvailableFoods: { type: [String] },
  itinerary: { type: [itinerary] },
  reviews: { type: [reviews] },
  CreatedBy: { type: Date, default: new Date() }
})