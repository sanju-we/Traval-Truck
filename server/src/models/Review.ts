import { model, Schema } from 'mongoose';
import { IReviews } from '../core/interface/modelInterface/IReviews';

const reviewSchema = new Schema<IReviews>({
  vendor: {
    type: String,
    required: true,
  },
  orderId: {
    type: String,
    required: true,
  },
  productId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
    ref:'User'
  },
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  replay:{
    type:String,
    ref:'Replay'
  },
  isReplayed:{type:Boolean},
  createdAt:{
    type:Date,
    default:new Date()
  }
});

export const Reviews = model<IReviews>('Reviews', reviewSchema);
