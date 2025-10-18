import { IAgencyProfileService } from '../../core/interface/serivice/agency/Iagenc.profile.service.js';
import { inject, injectable } from 'inversify';
import { IAgencyRespository } from '../../core/interface/repositorie/agency/Iagency.auth.repository.js';
import { ImageDeleteInCloudinary, UserNotFoundError } from '../../utils/resAndErrors.js';
import {
  toVendorRequestDTO,
  vendorRequestDTO,
} from '../../core/DTO/admin/vendor.response.dto/vendor.response.dto.js';
import { deleteImage, extractPublicId, singleUpload } from '../../utils/upload.cloudinary.js';

@injectable()
export class AgencyProfileService implements IAgencyProfileService {
  constructor(@inject('IAgencyRespository') private readonly _agencyAuthRepo: IAgencyRespository) { }
  async updateProfile(
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
  ): Promise<vendorRequestDTO> {
    const agency = await this._agencyAuthRepo.findById(id);
    if (!agency) throw new UserNotFoundError();

    const update = await this._agencyAuthRepo.update(id, data);
    if (!update) throw new UserNotFoundError();

    return toVendorRequestDTO(update);
  }

  async updateDocument(id: string,files: { [fieldname: string]: Express.Multer.File[] },): Promise<vendorRequestDTO> {
    let update;
    for (const fieldname in files) {
      const file = files[fieldname][0];

      const result = await singleUpload(file, 'Travel-Truck-Vendor-Document');
      update = await this._agencyAuthRepo.update(id, { [`documents.${fieldname}`]: result });
    }
    if (!update) throw new UserNotFoundError();

    return toVendorRequestDTO(update);
  }

  async deleteImage(id: string, documentUrl: string, key: string): Promise<vendorRequestDTO> {
    const publicId = extractPublicId(documentUrl)
    const result = await deleteImage(publicId)
    if (!result) throw new ImageDeleteInCloudinary()
    const updated = await this._agencyAuthRepo.update(id, { [`documents.${key}`]: null })
    if (!updated) throw new UserNotFoundError()
    return toVendorRequestDTO(updated)
  }

  async uploadProfile(id: string, image: Express.Multer.File): Promise<vendorRequestDTO | null> {
      const result = await singleUpload(image,'Travel-Travel-Document')
      const update = await this._agencyAuthRepo.update(id,{logo:result})
      if(update) return toVendorRequestDTO(update)
      return null
  }
}
