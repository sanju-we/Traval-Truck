import { IRestaurantProfileService } from '../../core/interface/serivice/restaurant/IRestaurant.profile.service.js';
import { inject, injectable } from 'inversify';
import { IRestaurantAuthRepository } from '../../core/interface/repositorie/restaurant/Irestaurant.auth.repository.js';
import { ImageDeleteInCloudinary, UserNotFoundError } from '../../utils/resAndErrors.js';
import {
  toVendorRequestDTO,
  vendorRequestDTO,
} from '../../core/DTO/admin/vendor.response.dto/vendor.response.dto.js';
import { deleteImage, extractPublicId, singleUpload } from '../../utils/upload.cloudinary.js';

@injectable()
export class RestaurantProfileService implements IRestaurantProfileService {
  constructor(
    @inject('IRestaurantAuthRepository')
    private readonly _restaurantAuthRepo: IRestaurantAuthRepository,
  ) { }
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
    const restaurant = await this._restaurantAuthRepo.findById(id);
    if (!restaurant) throw new UserNotFoundError();

    const update = await this._restaurantAuthRepo.update(id, data);
    if (!update) throw new UserNotFoundError();

    return toVendorRequestDTO(update);
  }

  async updateDocuments(
    id: string,
    files: { [fieldname: string]: Express.Multer.File[] },
  ): Promise<vendorRequestDTO | null> {
    let update;
    for (const fileName in files) {
      const file = files[fileName][0];

      const result = await singleUpload(file, 'Travel-Truck-Vendor-Document');
      update = await this._restaurantAuthRepo.update(id, { [`documents.${fileName}`]: result });
    }

    if(update) return toVendorRequestDTO(update);
    return null
  }

  async deleteImage(id: string, documentUrl: string, key: string): Promise<vendorRequestDTO> {
    const publicId = await extractPublicId(documentUrl)
    const result = await deleteImage(publicId)
    if (!result) throw new ImageDeleteInCloudinary()
    const data = await this._restaurantAuthRepo.update(id, { [`documents.${key}`]: null })
    if (!data) throw new UserNotFoundError()
    return toVendorRequestDTO(data)
  }
}
