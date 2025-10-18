import { IAgency } from '../../../../core/interface/modelInterface/IAgency.js';
import { IHotel } from '../../../../core/interface/modelInterface/IHotel.js';
import { IRestaurant } from '../../../../core/interface/modelInterface/IRestaurant.js';

export interface vendorRequestDTO {
  id: string;
  companyName: string;
  ownerName: string;
  email: string;
  role: string;
  logo:string;
  bankDetails: {
    accountHolder: string;
    accountNumber: string;
    bankName: string;
    ifscCode: string;
  };
  documents: {
    registrationCertificate: string;
    panCard: string;
    bankProof: string;
    ownerIdProof: string;
  };
  isApproved: boolean;
  phone: number;
}

export const toVendorRequestDTO = (vendor: IRestaurant | IHotel | IAgency): vendorRequestDTO => ({
  id: vendor._id.toString(),
  companyName: vendor.companyName,
  ownerName: vendor.ownerName,
  bankDetails: vendor.bankDetails,
  documents: vendor.documents,
  logo:vendor.logo,
  email: vendor.email,
  role: vendor.role,
  isApproved: vendor.isApproved,
  phone: vendor.phone,
});
