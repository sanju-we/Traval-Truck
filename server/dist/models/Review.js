import { model, Schema } from 'mongoose';
const reviewSchema = new Schema({
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
export const Reviews = model('Reviews', reviewSchema);
