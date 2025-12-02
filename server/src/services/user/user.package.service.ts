import { PackageDTO, toPackageDTO } from "@core/DTO/agency/request/packageDTO.js";
import { IUserPackageService } from "../../core/interface/serivice/user/IUser.package.service.js";
import { IAgencyPackageRepository } from "../../core/interface/repositorie/agency/Iagency.package.repository.js";
import { inject, injectable } from "inversify";
import { PackageResDTO, toPackageResDTO } from "../../core/DTO/agency/response/agency.packageDTO.js";
import { DataNotFoundError } from "../../utils/resAndErrors.js";
import { logger } from "../../utils/logger.js";
import { ISubscriptionHistoryRepository } from "../../core/interface/repositorie/shared/ISubscription.hisroty.repository.js";
import { IPaymentUtils } from "../../core/interface/PaymentInterface/Ipayment.utils.js";

@injectable()
export class UserPackageSerivce implements IUserPackageService {
  constructor(
    @inject('IAgencyPackageRepository') private readonly _packageRepo: IAgencyPackageRepository,
    @inject('ISubscriptionHistoryRepository') private readonly _subscriptionHistoryRepo: ISubscriptionHistoryRepository,
    @inject('IPaymentUtils') private readonly _paymentUtils: IPaymentUtils
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

  async initiativePurchase(packageId: string, userId: string, role: string): Promise<{ url: string; sessionId: string }> {
    const data = await this._packageRepo.findById(packageId)
    if (!data) throw new DataNotFoundError()

    return this._paymentUtils.createCheckoutSession({
      amount: data.price,
      currency: 'inr',
      description: `Package Plan: ${data.title}`,
      successUrl: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.FRONTEND_URL}/cancel`,
      metadata: {
        type: 'package',
        userId,
        role,
        packageId
      }
    })
  }
}