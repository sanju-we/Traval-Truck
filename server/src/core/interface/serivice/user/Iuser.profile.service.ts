import { userEdit,Userauth,IUser } from "types";

export interface IUserProfileService {
  setInterest(interests: string[], id: string): Promise<void>;
  updateProfile(formData:userEdit,user:Userauth) : Promise<IUser | null>;
}
