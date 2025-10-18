import { Document, Schema, Types } from 'mongoose';

export interface IRestaurant extends Document {
  _id: Types.ObjectId;
  companyName: string;
  address: Schema.Types.ObjectId;
  email: string;
  password: string;
  rating: number;
  totalReviews: number;
  cuisines: string[];
  bankDetails: {
    accountHolder: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  documents: {
    registrationCertificate: string;
    panCard: string;
    bankProof: string;
    ownerIdProof: string;
  };
  foodItems: Schema.Types.ObjectId;
  reviews: Schema.Types.ObjectId[];
  images: string[];
  logo:string;
  phone: number;
  ownerName: string;
  role: string;
  isApproved: boolean;
  isRestricted: boolean;
  reason: string
}
