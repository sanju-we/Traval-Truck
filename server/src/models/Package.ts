import mongoose, { Schema, model } from 'mongoose';
import { IPackage } from '../core/interface/modelInterface/Ipackage.js';


export const itinerary = {
  activities: [String],
  day: Number,
  title: String,
};
export const reviews = {
  Comment: String,
  Date: Date,
  Rating: Number,
  userID: String,
};

const packageSchema = new Schema<IPackage>({
  title: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  availableFoods: { type: [String] },
  discoveries: { type: [String], required: true },
  itinerary: { type: [itinerary] },
  reviews: { type: [reviews] },
  CreatedBy: { type: Date, default: new Date() },
  images: { type: [String], required: true },
  ownedBy:{type:String,ref:'Agency'}
});

export const Package = model<IPackage>('Package', packageSchema);