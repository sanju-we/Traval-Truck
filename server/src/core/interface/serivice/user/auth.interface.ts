import { UserData, userProfileDTO } from '../../../../types/index';

export interface IAuthService {
  generateOtp(): Promise<string>;
  storeOtp(email: string, otp: string): Promise<void>;
  verify(enteredEmail: string, enteredOtp: string, userData: UserData): Promise<{
    user: userProfileDTO;
    accessToken: string;
    refreshToken: string;
  }>;
  verifyLogin(email: string, password: string): Promise<{
    user: userProfileDTO;
    accessToken: string;
    refreshToken: string;
  }>;
  sendLink(email: string): Promise<void>;
  resetPassword(token: string, newPassword: string): Promise<void>;
}