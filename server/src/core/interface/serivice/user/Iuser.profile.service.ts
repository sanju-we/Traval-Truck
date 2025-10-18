import { userProfileDTO } from '../../../DTO/user/Response/user.profile.js';
import { userEdit, Userauth, IUser } from 'types';

export interface IUserProfileService {
  setInterest(interests: string[], id: string): Promise<void>;
  updateProfile(formData: userEdit, user: Userauth): Promise<IUser | null>;
  uploadProfileImage(id:string,image:Express.Multer.File) : Promise<userProfileDTO | null>;
}
