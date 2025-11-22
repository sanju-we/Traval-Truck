import { PackageDTO, toPackageDTO } from "@core/DTO/agency/request/packageDTO.js";
import { IUserPackageService } from "../../core/interface/serivice/user/IUser.package.service.js";
import { IAgencyPackageRepository } from "../../core/interface/repositorie/agency/Iagency.package.repository.js";
import { inject, injectable } from "inversify";
import { PackageResDTO, toPackageResDTO } from "../../core/DTO/agency/response/agency.packageDTO.js";
import { DataNotFoundError } from "../../utils/resAndErrors.js";
import { logger } from "../../utils/logger.js";
import { ISubscriptionHistoryRepository } from "../../core/interface/repositorie/shared/ISubscription.hisroty.repository.js";

@injectable()
export class UserPackageSerivce implements IUserPackageService {
  constructor(
    @inject('IAgencyPackageRepository') private readonly _packageRepo: IAgencyPackageRepository,
    @inject('ISubscriptionHistoryRepository') private readonly _subscriptionHistoryRepo: ISubscriptionHistoryRepository
  ) { }
  async getLatestPackage(): Promise<PackageResDTO[]> {
    const data = await this._packageRepo.findAllPackageWithPartners(1)
    const checks = await Promise.all(
      data.data.map(async (pkg) => {
        const agency = await this._subscriptionHistoryRepo.findOne({
          userId: pkg.ownedBy,
        })
        return agency ? pkg : null
      })
    )
    const result = checks.filter((pkg) => pkg !== null) as PackageResDTO[]
    if (data) return result
    throw new DataNotFoundError()
  }

  async getAllPackage(page: number, limit: number, search?: string): Promise<{ data: PackageResDTO[]; total: number; page: number; totalPages: number; }> {
    const data = await this._packageRepo.findAllPackageWithPartners(page, limit, search)
    const checks = await Promise.all(
      data.data.map(async (pkg) => {
        const agency = await this._subscriptionHistoryRepo.findOne({
          userId: pkg.ownedBy,
        })
        return agency ? pkg : null
      })
    )
    const result = checks.filter((pkg) => pkg !== null) as PackageResDTO[]
    data.data = result
    if (data) return data
    throw new DataNotFoundError()
  }

  async getPackage(id: string): Promise<PackageResDTO> {
    const data = await this._packageRepo.findPackageWithPartner(id)
    if (data) return data
    throw new DataNotFoundError()
  }
}