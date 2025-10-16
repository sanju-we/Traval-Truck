import { UserData, userProfileDTO } from '../../../types/index.js';
import { IUser } from '../modelInterface/IUser.js';
import { userEdit } from '../../../types/index.js';
import { IBaserepository } from './IBaseRepositories.js';

export interface IAuthRepository extends IBaserepository<IUser> {
  updatePasswordById(id: string, password: string): Promise<void>;
  findByIdAndUpdateAction(id: string, action: boolean | string[], field: string): Promise<void>;
  findByIdAndUpdateProfile(id: string, data: userEdit): Promise<IUser | null>;
}
