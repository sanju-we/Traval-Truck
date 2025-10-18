import { IUser } from '../core/interface/modelInterface/IUser.js';
import { Schema, model } from 'mongoose';
// inferASchemaType and hyderatedDocument
const userSchema: Schema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
  },
  userName: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  interest: [
    {
      type: String,
    },
  ],
  password: {
    type: String,
    unique: false,
  },
  googleId: {
    type: String,
    unique: false,
  },
  gender: {
    type: String,
    required: false,
  },
  bio: {
    type: String,
    required: false,
  },
  profilePicture: {
    type: String,
  },
  createdOn: {
    type: Date,
    default: new Date(),
  },
  role: {
    type: String,
    required: true,
  },
  isBlocked: {
    type: Boolean,
    required: true,
  },
});

export const User = model<IUser>('User', userSchema);
