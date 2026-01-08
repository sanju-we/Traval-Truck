import { Document, Types } from "mongoose";

export interface IReplay extends Document{
  _id:Types.ObjectId;
  comment:string,
  replayer:string,
  productId:string,
  replayerId:string,
  reviewId:string,
}