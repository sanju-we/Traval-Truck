import { vendorData } from 'types';
import { RestaurantProfileDTO } from '../../../../core/DTO/restaurant/response.dto.js';

export interface IRestaurantAuthService {
  verifyRestaurantSignup(
    enteredEmail: string,
    enteredOTP: string,
    restaurantData: vendorData,
  ): Promise<{ restaurant: RestaurantProfileDTO; accessToken: string; refreshToken: string }>;
  verifyLogin(
    email: string,
    password: string,
  ): Promise<{ restaurantData: RestaurantProfileDTO; accessToken: string; refreshToken: string }>;
  sendResetLink(email: string): Promise<void>;
  resetPassword(newPassword: string, token: string): Promise<void>;
}
