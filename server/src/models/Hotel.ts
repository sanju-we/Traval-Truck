import { Schema, model } from 'mongoose';
import { IHotel } from '../core/interface/modelInterface/IHotel.js';

const hotelSchema = new Schema<IHotel>({
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
  gstNumber: {
    type: String,
    required: false,
  },
  taxId: {
    type: String,
    required: false,
  },
  rating: {
    type: Number,
    default: 0,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  packages: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Package',
      required: false,
    },
  ],
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Reviews',
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
  role: {
    type: String,
    required: true,
  },
  isRestricted: {
    type: Boolean,
    default: false,
  },
});

export const Hotel = model<IHotel>('Hotel', hotelSchema);
