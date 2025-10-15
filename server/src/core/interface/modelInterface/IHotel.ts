import { Document, Schema, Types } from 'mongoose';

export interface IHotel extends Document {
  _id: Types.ObjectId;
  companyName: string;
  address: Schema.Types.ObjectId;
  email: string;
  password: string;
  gstNumber: string,
  taxId: string;
  rating: number;
  totalReviews: Number;
  packages: Schema.Types.ObjectId[];
  reviews: Schema.Types.ObjectId[];
  images: string[];
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
  phone: number;
  ownerName: string;
  isApproved: boolean;
  role: string;
  isRestricted: boolean;
}
