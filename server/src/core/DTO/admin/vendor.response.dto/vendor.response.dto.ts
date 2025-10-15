import { IAgency } from '../../../../core/interface/modelInterface/IAgency.js';
import { IHotel } from '../../../../core/interface/modelInterface/IHotel.js';
import { IRestaurant } from '../../../../core/interface/modelInterface/IRestaurant.js';

export interface vendorRequestDTO {
  id: string;
  companyName: string;
  ownerName: string;
  email: string;
  role: string;
  bankDetails :{
    accountHolder :string;
    accountNumber : string;
    bankName:string;
    ifscCode:string
  };
  documents: {
    registrationCertificate: String,
    panCard: String,
    bankProof: String,
    ownerIdProof: String,
  };
  isApproved: boolean;
  phone: number;
}

export const toVendorRequestDTO = (vendor: IRestaurant | IHotel | IAgency): vendorRequestDTO => ({
  id: vendor._id.toString(),
  companyName: vendor.companyName,
  ownerName: vendor.ownerName,
  bankDetails:vendor.bankDetails,
  documents:vendor.documents,
  email: vendor.email,
  role: vendor.role,
  isApproved: vendor.isApproved,
  phone: vendor.phone,
});
