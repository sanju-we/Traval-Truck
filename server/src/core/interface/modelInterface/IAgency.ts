import { Document, Schema, Types } from 'mongoose';

export interface IAgency extends Document {
  _id: Types.ObjectId;
  companyName: string;
  address: Schema.Types.ObjectId;
  email: string;
  password: string;
  rating: Number;
  totalReviews: Number;
  bankDetails: {
    accountHolder: string,
    accountNumber: string,
    ifscCode: string,
    bankName: string,
  };
  documents: {
    registrationCertificate: String,
    panCard: String,
    bankProof: String,
    ownerIdProof: String,
  };
  packages: Schema.Types.ObjectId[];
  reviews: Schema.Types.ObjectId[];
  images: string[];
  phone: number;
  ownerName: string;
  isApproved: boolean;
  role: string;
  isRestricted: boolean;
}
