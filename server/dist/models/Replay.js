import { model, Schema } from "mongoose";
const replaySchema = new Schema({
    comment: { type: String },
    replayer: { type: String },
    replayerId: { type: String, refPath: 'replayer' },
    productId: { type: String },
    reviewId: { type: String, ref: 'Review' }
});
export const Replay = model('Replay', replaySchema);
