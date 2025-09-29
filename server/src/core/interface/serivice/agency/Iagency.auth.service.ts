import { vendorData } from 'types';
import { agencyProfileDTO } from '../../../../core/DTO/agency/response/agency.profile.js';

export interface IAgencyAuthService {
  verifyAgencySignup(
    enteredEmail: string,
    enteredOtp: string,
    UserData: vendorData,
  ): Promise<{ accessToken: string; refreshToken: string; agencyData: agencyProfileDTO }>;
  verifyAgencyLogin(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string; agencyData: agencyProfileDTO }>;
  sendAgencyResetLink(email: string): Promise<void>;
  resetPassword(token: string, newPassword: string): Promise<void>;
}
