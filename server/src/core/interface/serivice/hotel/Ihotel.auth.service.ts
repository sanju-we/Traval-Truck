import { HotelProfileDTO } from '../../../../core/DTO/hotel/hotel.dto.js';
import { vendorData } from 'types';

export interface IHotelAuthService {
  verifyHotel(
    enteredEmail: string,
    enteredOtp: string,
    hotelData: vendorData,
  ): Promise<{ hotel: HotelProfileDTO; accessToken: string; refreshToken: string }>;
  verifyHotelLogin(
    email: string,
    password: string,
  ): Promise<{ hotel: HotelProfileDTO; accessToken: string; refreshToken: string }>;
  sendResetLink(email: string): Promise<void>;
  resetHotelPassword(newPassword: string, token: string): Promise<void>;
}
