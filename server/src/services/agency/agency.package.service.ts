import { PackageDTO, toPackageDTO } from "../../core/DTO/agency/request/packageDTO.js";
import { IAgencyPackageService } from "../../core/interface/serivice/agency/Iagency.package.service.js";
import { IAgencyPackageRepository } from "../../core/interface/repositorie/agency/Iagency.package.repository.js";
import { inject, injectable } from "inversify";
import { Data_Creation_Error } from "../../utils/resAndErrors.js";
import z from "zod";
import { PackageResDTO, toPackageResDTO } from "../../core/DTO/agency/response/agency.packageDTO.js";
import { logger } from "../../utils/logger.js";

@injectable()
export class AgencyPackageService implements IAgencyPackageService {
  constructor(
    @inject('IAgencyPackageRepository') private readonly _agencyPackeageRepository: IAgencyPackageRepository
  ) { }

  async getAllPackage(page:number): Promise<{ data: PackageResDTO[]; total: number; page: number; totalPages: number; }> {
    const allPackage = await this._agencyPackeageRepository.findAllPackageWithPartners(page)
      return allPackage
  }

  async addPackage(data: PackageDTO): Promise<{ data: PackageResDTO[]; total: number; page: number; totalPages: number; }> {
    const itinerarySchema = z.object({
      day: z.number().int().positive("Day must be a positive integer"),
      title: z.string().min(1, "Title is required"),
      activities: z
        .array(z.string().min(1, "Activity cannot be empty"))
        .min(1, "At least one activity required"),
    });
    const partnerPackageSchema = z.object({
      title: z.string().min(1, "Title is required"),
      description: z.string().min(1, "Description is required"),
      duration: z.string().min(1, "Duration is required"),

      price: z
        .string()
        .regex(/^\d+$/, "Price must be a number string")
        .transform((val) => parseInt(val, 10)),

      availableFoods: z
        .array(z.string().min(1))
        .nonempty("At least one food item required"),

      dining: z
        .array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"))
        .nonempty("At least one dining ID required"),

      hotels: z
        .array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"))
        .nonempty("At least one hotel ID required"),

      discoveries: z
        .array(z.string().min(1))
        .nonempty("At least one discovery required"),

      itinerary: z
        .array(itinerarySchema)
        .min(1, "At least one itinerary day required"),
    });
    partnerPackageSchema.parse(data)
    logger.info('data:',data)
    const packageData = await this._agencyPackeageRepository.create(data)
    if (packageData) return await this.getAllPackage(1)
    throw new Data_Creation_Error()
  }
}