import { IAgency } from '../../../../core/interface/modelInterface/IAgency.js';
import { IHotel } from '../../../../core/interface/modelInterface/IHotel.js';
import { IRestaurant } from '../../../../core/interface/modelInterface/IRestaurant.js';

export interface VendorAuth {
  id: string;
  companyName: string;
  email: string;
  ownerName: string;
  role: string;
  isBlocked: boolean;
  isRestricted:boolean;
}

export const toVendorAuth = (vendor: IRestaurant | IHotel | IAgency): VendorAuth => ({
  id: vendor._id.toString(),
  companyName: vendor.companyName,
  email: vendor.email,
  ownerName: vendor.ownerName,
  role: vendor.ownerName,
  isBlocked: vendor.isApproved,
  isRestricted: vendor.isRestricted
});
