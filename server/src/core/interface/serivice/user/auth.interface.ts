import { UserData, userProfileDTO } from '../../../../types/index.js';

export interface IAuthService {
  verify(
    enteredEmail: string,
    enteredOtp: string,
    userData: UserData,
  ): Promise<{
    user: userProfileDTO;
    accessToken: string;
    refreshToken: string;
  }>;
  verifyLogin(
    email: string,
    password: string,
  ): Promise<{
    user: userProfileDTO;
    accessToken: string;
    refreshToken: string;
  }>;
  sendLink(email: string): Promise<void>;
  resetPassword(token: string, newPassword: string): Promise<void>;
}
