import { UserData, userProfileDTO } from '../../../types/index.js';
import { IUser } from '../modelInterface/IUser.js';
import { userEdit } from '../../../types/index.js';

export interface IAuthRepository {
  findByEmail(email: string): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;
  createUser(
    data: UserData & { isBlocked: boolean; password: string; role: string },
  ): Promise<IUser>;
  updatePasswordById(id: string, password: string): Promise<void>;
  findAll(): Promise<userProfileDTO[]>;
  findByIdAndUpdateAction(id: string, action: boolean | string[], field: string): Promise<void>;
  findByIdAndUpdateProfile(id:string,data:userEdit) : Promise<IUser | null>;
}
