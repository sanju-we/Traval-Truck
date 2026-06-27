import { IUser } from '../../../interface/modelInterface/IUser';

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