import { vendorRequestDTO } from '../../../DTO/admin/vendor.response.dto/vendor.response.dto.js';

export interface IHotelProfileService {
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
  updateDocuments(
    hotelId: string,
    files: { [fieldname: string]: Express.Multer.File[] },
  ): Promise<vendorRequestDTO | null>;

  deleteImage(id:string,documentUrl:string,key:string) : Promise<vendorRequestDTO>;
}
