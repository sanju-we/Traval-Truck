import { model, Schema } from 'mongoose';
import { IReviews } from '../core/interface/modelInterface/IReviews.js';

const reviewSchema = new Schema<IReviews>({
  vendor: {
    type: String,
    required: true,
  },
  packageId: {
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
});

export const Reviews = model<IReviews>('Reviews', reviewSchema);
