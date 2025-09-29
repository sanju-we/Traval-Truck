import { IAgency } from '../../../../core/interface/modelInterface/IAgency.js';
import { IHotel } from '../../../../core/interface/modelInterface/IHotel.js';
import { IRestaurant } from '../../../../core/interface/modelInterface/IRestaurant.js';

export interface vendorRequestDTO {
  id: string;
  companyName: string;
  ownerName: string;
  email: string;
  role: string;
  isApproved: boolean;
  phone: number;
}

export const toVendorRequestDTO = (vendor: IRestaurant | IHotel | IAgency): vendorRequestDTO => ({
  id: vendor._id.toString(),
  companyName: vendor.companyName,
  ownerName: vendor.ownerName,
  email: vendor.email,
  role: vendor.role,
  isApproved: vendor.isApproved,
  phone: vendor.phone,
});
