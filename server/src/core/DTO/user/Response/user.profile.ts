import { IUser } from '../../../interface/modelInterface/IUser.js';

export interface userProfileDTO {
  id: string;
  name: string;
  userName?: string;
  email: string;
  isBlocked: boolean;
  role: string;
  profilePicture?: string;
  bio?: string;
  phoneNumber?: number;
  gender?: string;
  interest?: string[];
}

export const toUserProfileDTO = (user: IUser): userProfileDTO => ({
  id: user._id.toString(),
  name: user.name,
  userName: user.userName || 'Unknown',
  email: user.email,
  bio: user.bio,
  phoneNumber: user.phoneNumber,
  profilePicture: user.profilePicture,
  role: user.role,
  isBlocked: user.isBlocked,
  interest: user.interest,
});
