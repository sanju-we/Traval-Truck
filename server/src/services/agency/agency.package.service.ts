import { PackageDTO } from "../../core/DTO/agency/request/packageDTO.js";
import { IAgencyPackageService } from "../../core/interface/serivice/agency/Iagency.package.service.js";
import { IAgencyPackageRepository } from "../../core/interface/repositorie/agency/Iagency.package.repository.js";
import { inject, injectable } from "inversify";
import { Data_Creation_Error, DataNotFoundError } from "../../utils/resAndErrors.js";
import { PackageResDTO, toPackageResDTO } from "../../core/DTO/agency/response/agency.packageDTO.js";
import { IAuthValidator } from '../../core/interface/validator/Iauth.validator.js'
import { logger } from "../../utils/logger.js";
import { deleteImage, extractPublicId, singleUpload } from "../../utils/upload.cloudinary.js";
import { IAgencyRespository } from "../../core/interface/repositorie/agency/Iagency.auth.repository.js";

@injectable()
export class AgencyPackageService implements IAgencyPackageService {
  constructor(
    @inject('IAgencyPackageRepository') private readonly _agencyPackeageRepository: IAgencyPackageRepository,
    @inject('IAuthValidator') private readonly _authValidator: IAuthValidator,
    @inject('IAgencyRespository') private readonly _agencyRepo : IAgencyRespository
  ) { }

  async getAllPackage(page: number): Promise<{ data: PackageResDTO[]; total: number; page: number; totalPages: number; }> {
    const allPackage = await this._agencyPackeageRepository.findAllPackageWithPartners(page)
    return allPackage
  }

  async addPackage(data: PackageDTO, files: { [fieldname: string]: Express.Multer.File[] }, id:string): Promise<{ data: PackageResDTO[]; total: number; page: number; totalPages: number; }> {
    if (typeof data.discoveries === 'string') {
      data.discoveries = JSON.parse(data.discoveries);
    }
    if (typeof data.availableFoods === 'string') {
      data.availableFoods = JSON.parse(data.availableFoods);
    }
    if (typeof data.itinerary === 'string') {
      data.itinerary = JSON.parse(data.itinerary);
    }
    await this._authValidator.addPackageValidator(data)
    const agency = await this._agencyRepo.findById(id)
    const images: string[] = []
    for (const fieldname in files) {
      const fileArray = files[fieldname];
      for (const file of fileArray) {
        const result = await singleUpload(file, "Travel-Truck-Vendor-Document");
        images.push(result);
      }
    }
    const packageData = await this._agencyPackeageRepository.create({ ...data, images: images, ownedBy:id })
    if (packageData) {
      agency?.packages.push(packageData._id.toString())
      await agency?.save()
      return await this.getAllPackage(1)
    }
    throw new Data_Creation_Error()
  }

  async updatePackage(id: string, data: PackageDTO, files: { [fieldname: string]: Express.Multer.File[]; }): Promise<PackageResDTO> {
    if (typeof data.discoveries === 'string') {
      data.discoveries = JSON.parse(data.discoveries);
    }
    if (typeof data.availableFoods === 'string') {
      data.availableFoods = JSON.parse(data.availableFoods);
    }
    if (typeof data.itinerary === 'string') {
      data.itinerary = JSON.parse(data.itinerary);
    }
    await this._authValidator.addPackageValidator(data)
    const images: string[] = []
    logger.info(files)
    for (const fieldname in files) {
      const fileArray = files[fieldname];
      for (const file of fileArray) {
        const result = await singleUpload(file, "Travel-Truck-Vendor-Document");
        images.push(result);
      }
    }
    const packageData = await this._agencyPackeageRepository.update(id, data)
    if (!packageData) throw new DataNotFoundError()
    packageData.images.push(...images)
    logger.info(packageData)
    await packageData.save()
    return toPackageResDTO(packageData)
  }

  async deleteImage(id: string, index: number): Promise<PackageResDTO> {
    const packageData = await this._agencyPackeageRepository.findById(id)
    if (!packageData) throw new DataNotFoundError()
    const publicId = await extractPublicId(packageData.images[index])
    const deletedInCloudinary = await deleteImage(publicId)
    if (!deletedInCloudinary) throw new DataNotFoundError()
    packageData.images.splice(index, 1)
    const update = await packageData.save()
    if (update) return toPackageResDTO(packageData)
    throw new DataNotFoundError()
  }
}