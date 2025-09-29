import { IUser } from '../../../interface/modelInterface/IUser.js';

export interface IUserRequest {
  id: string;
  name: string;
  email: string;
  phone: number;
  interesets: string[];
  role: string;
  isBlocked: boolean;
}

export const userSignupDTO = (user: IUser): IUserRequest => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  phone: user.phoneNumber,
  interesets: user.interest,
  role: user.role,
  isBlocked: user.isBlocked,
});
