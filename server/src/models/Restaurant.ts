import { Document,Schema,model } from "mongoose";
import { IRestaurant } from "../core/interface/modelInterface/IRestaurant.js";

const restaurantSchema = new Schema<IRestaurant>(
  {
    hotel:{
      type:String,
      required:true,
      unique:true
    },
    email:{
      type:String,
      unique:true,
      required:true
    },
    password:{
      type:String,
      required:true
    },
    rating:{
      type:Number,
      default:0
    },
    totalReviews:{
      type:Number,
      default:0
    },
    cuisines:[{
      type:String
    }],
    foodItems:{
      type:Schema.Types.ObjectId,
      unique:false
    },
    reviews:[{
      type:Schema.Types.ObjectId
    }],
    images:[{
      type:String
    }],
    Phone:{
      type:Number,
      required:true
    },
    ownerName:{
      type:String,
      required:true
    }
  }
)

export const Restaurant = model<IRestaurant>("Restaurant",restaurantSchema)