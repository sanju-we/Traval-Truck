import { IHotel } from '../../../core/interface/modelInterface/IHotel.js';

export interface HotelProfileDTO {
  id: string;
  companyName: String;
  ownerName: String;
  email: String;
  password: string;
  approved: Boolean;
  rating?: Number;
  totalReviews?: Number;
  role: String;
  phone?: Number;
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
