import mongoose, { Schema } from 'mongoose';
import { ISubscriptions } from '../core/interface/modelInterface/Isubscription.js';
import { IDuration } from '../core/interface/modelInterface/Isubscription.js';

const SubscriptionsSchema: Schema = new Schema({
  Name: { type: String },
  Category: { type: String, enum: ['premium', 'platinum', 'normal'] },
  Duration: {
    startingDate: {
      type: Date,
    },
    endingDate: {
      type: Date
    }
  },
  Valid: { type: Number },
  Description: { type: String },
  Amount: { type: Number },
  Features: [{ type: String, }],
  IsActive: { type: Boolean,default:false },
  CreatedAt: { type: Date },
});

const Subscription = mongoose.model<ISubscriptions>('Subscription', SubscriptionsSchema);

export default Subscription;