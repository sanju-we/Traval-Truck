import { PackageDTO, toPackageDTO } from "@core/DTO/agency/request/packageDTO.js";
import { IUserPackageService } from "../../core/interface/serivice/user/IUser.package.service.js";
import { IAgencyPackageRepository } from "../../core/interface/repositorie/agency/Iagency.package.repository.js";
import { inject, injectable } from "inversify";
import { PackageResDTO, toPackageResDTO } from "../../core/DTO/agency/response/agency.packageDTO.js";
import { DataNotFoundError } from "../../utils/resAndErrors.js";

@injectable()
export class UserPackageSerivce implements IUserPackageService {
  constructor(
    @inject('IAgencyPackageRepository') private readonly _packageRepo: IAgencyPackageRepository
  ) { }
  async getLatestPackage(): Promise<PackageResDTO[]> {
    const data = await this._packageRepo.findAllPackageWithPartners(1)
    if (data) return data.data
    throw new DataNotFoundError()
  }

  async getAllPackage(page: number, limit: number): Promise<{ data: PackageResDTO[]; total: number; page: number; totalPages: number; }> {
    const data = await this._packageRepo.findAllPackageWithPartners(page, limit)
    if (data) return data
    throw new DataNotFoundError()
  }

  async getPackage(id: string): Promise<PackageResDTO> {
    const data = await this._packageRepo.findPackageWithPartner(id)
    if (data) return data
    throw new DataNotFoundError()
  }
}