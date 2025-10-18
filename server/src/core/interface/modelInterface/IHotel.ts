import { Document, Schema, Types } from 'mongoose';

export interface IHotel extends Document {
  _id: Types.ObjectId;
  companyName: string;
  address: Schema.Types.ObjectId;
  email: string;
  password: string;
  gstNumber: string;
  taxId: string;
  rating: number;
  totalReviews: number;
  packages: Schema.Types.ObjectId[];
  reviews: Schema.Types.ObjectId[];
  images: string[];
  logo:string;
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
  phone: number;
  ownerName: string;
  isApproved: boolean;
  role: string;
  isRestricted: boolean;
  reason: string
}
