import { IFoods } from "../core/interface/modelInterface/IFoods.js";
import mongoose, { Schema } from "mongoose";

const FoodsSchema: Schema = new Schema({
  Restaurant: { type: String, ref: 'Restaurant' },
  Name: { type: String },
  Price: { type: Number },
  AvailableQuantity: { type: Number },
  Category: { type: String },
  Description: { type: String },
  Image: { type: [String] },
  Status:{type:String, enum: [ 'Available', 'Finish' ]}
});

const Foods = mongoose.model<IFoods>('Foods', FoodsSchema);

export default Foods;