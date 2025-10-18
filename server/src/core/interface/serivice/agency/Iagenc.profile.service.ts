import { vendorRequestDTO } from '../../../DTO/admin/vendor.response.dto/vendor.response.dto.js';

export interface IAgencyProfileService {
  updateProfile(
    id: string,
    data: {
      ownerName: string;
      companyName: string;
      phone: number;
      bankDetails: {
        ifscCode: string;
        bankName: string;
        accountNumber: string;
        accountHolder: string;
      };
    },
  ): Promise<vendorRequestDTO>;
  updateDocument(
    id: string,
    files: { [fieldname: string]: Express.Multer.File[] },
  ): Promise<vendorRequestDTO>;
  deleteImage(id:string,documentUrl:string,key:string) : Promise<vendorRequestDTO>;
  uploadProfile(id:string,image:Express.Multer.File) : Promise<vendorRequestDTO | null>;
}
