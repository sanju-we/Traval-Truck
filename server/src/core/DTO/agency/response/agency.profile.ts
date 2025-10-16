import { IAgency } from '../../../../core/interface/modelInterface/IAgency.js';

export interface agencyProfileDTO {
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

export const toAgencyProfileDTO = (agency: IAgency): agencyProfileDTO => ({
  id: agency._id.toString(),
  companyName: agency.companyName,
  ownerName: agency.ownerName,
  email: agency.email,
  password: agency.password,
  phone: agency.phone,
  role: agency.role,
  approved: agency.isApproved,
  rating: agency.rating,
  totalReviews: agency.totalReviews,
});
