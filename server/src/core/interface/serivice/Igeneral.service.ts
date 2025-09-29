export interface IGeneralService {
  generateOtp(): Promise<string>;
  storeOtp(email: string, otp: string): Promise<void>;
}
