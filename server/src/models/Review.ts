import { model, Schema } from 'mongoose';
import { IReviews } from '../core/interface/modelInterface/IReviews.js';

const reviewSchema = new Schema<IReviews>({
  vendor: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
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
