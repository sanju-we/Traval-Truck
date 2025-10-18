import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  phoneNumber: number;
  userName: string;
  email: string;
  interest: string[];
  password: string;
  googleId: string;
  gender: 'Male' | 'Female';
  bio: string;
  profilePicture: string;
  createdOn: Date;
  role: string;
  isBlocked: boolean;
}
