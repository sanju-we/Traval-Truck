import { IAgency } from '../../../../core/interface/modelInterface/IAgency.js';

export interface agencyProfileDTO {
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
