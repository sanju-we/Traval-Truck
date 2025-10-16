import { IRestaurant } from '../../../core/interface/modelInterface/IRestaurant.js';

export interface RestaurantProfileDTO {
  id: string;
  companyName: string;
  ownerName: string;
  email: string;
  password: string;
  approved: boolean;
  rating?: number;
  totalReviews?: number;
  role: string;
  phone?: number;
}

export const toRestaunrantProfile = (restaunrat: IRestaurant): RestaurantProfileDTO => ({
  id: restaunrat._id.toString(),
  companyName: restaunrat.companyName,
  ownerName: restaunrat.ownerName,
  email: restaunrat.email,
  password: restaunrat.password,
  phone: restaunrat.phone,
  role: restaunrat.role,
  approved: restaunrat.isApproved,
  rating: restaunrat.rating,
  totalReviews: restaunrat.totalReviews,
});
