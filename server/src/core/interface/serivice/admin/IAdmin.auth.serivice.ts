import { userProfileDTO } from "../../../../types/index";

export interface IAdminAuthService {
  verifyAdminEmail(email: string,password:string): Promise<{
    admin: userProfileDTO;
    accessToken: string;
    refreshToken: string;
  }>
}