import { UserData, userProfileDTO } from '../../../../types/index';
import { IUser } from '../../modelInterface/IUser';
import { userEdit } from '../../../../types/index';
import { IBaserepository } from '../IBaseRepositories';

export interface IAuthRepository extends IBaserepository<IUser> {
  updatePasswordById(id: string, password: string): Promise<void>;
  findByIdAndUpdateAction(id: string, action: boolean | string[], field: string): Promise<void>;
  findByIdAndUpdateProfile(id: string, data: userEdit): Promise<IUser | null>;
}
