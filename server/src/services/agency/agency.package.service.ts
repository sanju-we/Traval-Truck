import { PackageDTO, toPackageDTO } from "../../core/DTO/agency/request/packageDTO.js";
import { IAgencyPackageService } from "../../core/interface/serivice/agency/Iagency.package.service.js";
import { IAgencyPackageRepository } from "../../core/interface/repositorie/agency/Iagency.package.repository.js";
import { inject, injectable } from "inversify";
import { Data_Creation_Error } from "../../utils/resAndErrors.js";
import { PackageResDTO } from "../../core/DTO/agency/response/agency.packageDTO.js";
import {IAuthValidator} from '../../core/interface/validator/Iauth.validator.js'
import { logger } from "../../utils/logger.js";

@injectable()
export class AgencyPackageService implements IAgencyPackageService {
  constructor(
    @inject('IAgencyPackageRepository') private readonly _agencyPackeageRepository: IAgencyPackageRepository,
    @inject('IAuthValidator') private readonly _authValidator : IAuthValidator
  ) { }

  async getAllPackage(page:number): Promise<{ data: PackageResDTO[]; total: number; page: number; totalPages: number; }> {
    const allPackage = await this._agencyPackeageRepository.findAllPackageWithPartners(page)
      return allPackage
  }

  async addPackage(data: PackageDTO): Promise<{ data: PackageResDTO[]; total: number; page: number; totalPages: number; }> {
    await this._authValidator.addPackageValidator(data)
    logger.info('data:',data)
    const packageData = await this._agencyPackeageRepository.create(data)
    if (packageData) return await this.getAllPackage(1)
    throw new Data_Creation_Error()
  }
}