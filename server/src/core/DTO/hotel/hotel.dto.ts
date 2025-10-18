import { IHotel } from '../../../core/interface/modelInterface/IHotel.js';

export interface HotelProfileDTO {
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

export const toHotelProfile = (hotel: IHotel): HotelProfileDTO => ({
  id: hotel._id.toString(),
  companyName: hotel.companyName,
  ownerName: hotel.ownerName,
  email: hotel.email,
  password: hotel.password,
  phone: hotel.phone,
  role: hotel.role,
  approved: hotel.isApproved,
  rating: hotel.rating,
  totalReviews: hotel.totalReviews,
});
