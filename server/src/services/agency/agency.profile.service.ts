import { IAgencyProfileService } from '../../core/interface/serivice/agency/Iagenc.profile.service';
import { inject, injectable } from 'inversify';
import { IAgencyRespository } from '../../core/interface/repositorie/agency/Iagency.auth.repository';
import { ImageDeleteInCloudinary, UserNotFoundError } from '../../utils/resAndErrors';
import {
  toVendorRequestDTO,
  vendorRequestDTO,
} from '../../core/DTO/admin/vendor.response.dto/vendor.response.dto';
import { deleteImage, extractPublicId, singleUpload } from '../../utils/upload.cloudinary';
import { IAuthValidator } from '../../core/interface/validator/Iauth.validator';

@injectable()
export class AgencyProfileService implements IAgencyProfileService {
  constructor(
    @inject('IAgencyRespository') private readonly _agencyAuthRepo: IAgencyRespository,
    @inject('IAuthValidator') private readonly _authValidator: IAuthValidator
  ) { }
  async updateProfile(
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
  ): Promise<vendorRequestDTO> {
    await this._authValidator.profileUpdateValidator(data.ownerName, data.companyName, data.phone, data.bankDetails)
    const agency = await this._agencyAuthRepo.findById(id);
    if (!agency) throw new UserNotFoundError();

    const update = await this._agencyAuthRepo.update(id, data);
    if (!update) throw new UserNotFoundError();

    return toVendorRequestDTO(update);
  }

  async updateDocument(
    id: string,
    files: { [fieldname: string]: Express.Multer.File[] },
  ): Promise<vendorRequestDTO | null> {
    let update;
    for (const fieldname in files) {
      const file = files[fieldname][0];

      const result = await singleUpload(file, 'Travel-Truck-Vendor-Document');
      update = await this._agencyAuthRepo.update(id, { [`documents.${fieldname}`]: result });
    }
    if (update) {
      update.isRestricted && await this._agencyAuthRepo.update(id, { isRestricted: false });
      return toVendorRequestDTO(update);
    }

    return null;
  }

  async deleteImage(id: string, documentUrl: string, key: string): Promise<vendorRequestDTO> {
    const publicId = extractPublicId(documentUrl);
    const result = await deleteImage(publicId);
    if (!result) throw new ImageDeleteInCloudinary();
    const updated = await this._agencyAuthRepo.update(id, { [`documents.${key}`]: null });
    if (!updated) throw new UserNotFoundError();
    return toVendorRequestDTO(updated);
  }

  async uploadProfile(id: string, image: Express.Multer.File): Promise<vendorRequestDTO | null> {
    const result = await singleUpload(image, 'Travel-Travel-Document');
    const update = await this._agencyAuthRepo.update(id, { logo: result });
    if (update) return toVendorRequestDTO(update);
    return null;
  }
}
