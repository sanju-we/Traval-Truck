import { vendorRequestDTO } from '../../../DTO/admin/vendor.response.dto/vendor.response.dto';

export interface IHotelProfileService {
  updateProfile(
    id: string,
    data: {
      ownerName: string;
      companyName: string;
      address?: string;
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

  deleteImage(id: string, documentUrl: string, key: string): Promise<vendorRequestDTO>;
  uploadImage(id: string, image: Express.Multer.File): Promise<vendorRequestDTO | null>;
}
