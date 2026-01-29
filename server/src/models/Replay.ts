import { model, Schema } from "mongoose";
import { IReplay } from "../core/interface/modelInterface/IReplay";

const replaySchema = new Schema<IReplay>({
  comment:{type:String},
  replayer:{type:String},
  replayerId:{type:String,refPath:'replayer'},
  productId:{type:String},
  reviewId:{type:String,ref:'Review'}
})

export const Replay = model<IReplay>('Replay',replaySchema);