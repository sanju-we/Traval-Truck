import { Document,Schema,Types } from "mongoose";

export interface IRestaurant extends Document{
  _id: Types.ObjectId,
  hotel:String,
  address:Schema.Types.ObjectId,
  email:String,
  password:String,
  rating:Number,
  totalReviews:Number,
  cuisines : String[],
  foodItems : Schema.Types.ObjectId,
  reviews:Schema.Types.ObjectId[],
  images:String[],
  Phone:Number,
  ownerName:String
}