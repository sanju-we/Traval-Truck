import { IHotelProfileService } from "../../core/interface/serivice/hotel/Ihotel.profile.service.js";
import { inject, injectable } from "inversify";
import { IHotelAuthRepository } from "../../core/interface/repositorie/Hotel/Ihotel.auth.repository.js";
import { UserNotFoundError } from "../../utils/resAndErrors.js";
import { toVendorRequestDTO, vendorRequestDTO } from "../../core/DTO/admin/vendor.response.dto/vendor.response.dto.js";
import { singleUpload } from "../../utils/upload.cloudinary.js";
import { logger } from "../../utils/logger.js";

@injectable()
export class HotelProfileService implements IHotelProfileService {
  constructor(
    @inject('IHotelAuthRepository') private readonly _hotelAuthRepo: IHotelAuthRepository
  ) { }
  async updateProfile(id: string, data: { ownerName: string, companyName: string, phone: number, bankDetails: { ifscCode: string, bankName: string, accountNumber: string, accountHolder: string } }): Promise<vendorRequestDTO> {
    const hotel = await this._hotelAuthRepo.findById(id)
    if (!hotel) throw new UserNotFoundError()

    const update = await this._hotelAuthRepo.update(id, data)
    if (!update) throw new UserNotFoundError()

    return toVendorRequestDTO(update)
  }

  async updateDocuments(hotelId: string, files: { [fieldname: string]: Express.Multer.File[] }): Promise<vendorRequestDTO> {
    let update;
    for (let fileName in files) {
      const file = files[fileName][0]

      const result = await singleUpload(file, 'Travel-Truck-Vendor-Document')
      update = await this._hotelAuthRepo.update(hotelId, { [`documents.${fileName}`]: result })
    }

    if (!update) throw new UserNotFoundError()

    return toVendorRequestDTO(update)
  }
}