import {  UserData } from '../../../types/index';
import { IUser } from '../modelInterface/IUser';

export interface IAuthRepository {
  findByEmail(email: string): Promise<IUser | null>;
  findById(id:string):Promise<IUser | null>;
  createUser(data: UserData & { isBlocked: boolean; password: string; role: string }): Promise<IUser>;
  otpSend(email: string, otp: string): Promise<void>;
  sendEmail(email: string, resetLink: string): Promise<void>;
  updatePasswordById(id: string, password: string): Promise<void>;
}