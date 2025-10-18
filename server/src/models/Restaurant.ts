import { Schema, model } from 'mongoose';
import { IRestaurant } from '../core/interface/modelInterface/IRestaurant.js';

const restaurantSchema = new Schema<IRestaurant>({
  companyName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  cuisines: [
    {
      type: String,
    },
  ],
  foodItems: {
    type: Schema.Types.ObjectId,
    unique: false,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
    },
  ],
  images: [
    {
      type: String,
    },
  ],
  logo:{
    type:String,
    default:null
  },
  bankDetails: {
    accountHolder: {
      type: String,
    },
    accountNumber: {
      type: String,
    },
    ifscCode: {
      type: String,
    },
    bankName: {
      type: String,
    },
  },
  documents: {
    registrationCertificate: {
      type: String,
    },
    panCard: {
      type: String,
    },
    bankProof: {
      type: String,
    },
    ownerIdProof: {
      type: String,
    },
  },
  phone: {
    type: Number,
    required: true,
  },
  ownerName: {
    type: String,
    required: true,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  isRestricted: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    required: true,
  },
  reason:{
    type:String,
    required: false
  }
});

export const Restaurant = model<IRestaurant>('Restaurant', restaurantSchema);
