import { IUserPackageService } from "../../core/interface/serivice/user/IUser.package.service";
import { IAgencyPackageRepository } from "../../core/interface/repositorie/agency/Iagency.package.repository";
import { inject, injectable } from "inversify";
import { PackageResDTO } from "../../core/DTO/agency/response/agency.packageDTO";
import { Data_Creation_Error, DataNotFoundError } from "../../utils/resAndErrors";
import { ISubscriptionHistoryRepository } from "../../core/interface/repositorie/shared/ISubscription.hisroty.repository";
import { IPaymentUtils } from "../../core/interface/PaymentInterface/Ipayment.utils";
import { IAdminCouponRepository } from "../../core/interface/repositorie/admin/Iadmin.coupon.repository";
import { CouponDTO, toCouponDTO } from "../../core/DTO/admin/coupon/admin.coupon.response";
import { IWalletRespository } from "../../core/interface/repositorie/shared/IWallet.repository";
import { IOrdersRepository } from "../../core/interface/repositorie/User/Iorders.repository";
import { Types } from "mongoose";

@injectable()
export class UserPackageSerivce implements IUserPackageService {
  constructor(
    @inject('IAgencyPackageRepository') private readonly _packageRepo: IAgencyPackageRepository,
    @inject('ISubscriptionHistoryRepository') private readonly _subscriptionHistoryRepo: ISubscriptionHistoryRepository,
    @inject('IPaymentUtils') private readonly _paymentUtils: IPaymentUtils,
    @inject('IWalletRespository') private readonly _walletRepo: IWalletRespository,
    @inject('IOrdersRepository') private readonly _orderRepo: IOrdersRepository,
    @inject('IAdminCouponRepository') private readonly _couponRepo: IAdminCouponRepository
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

  async initiativePurchase(packageId: string, userId: string, role: string, amount: number, couponId: string, maxPeople?: number): Promise<{ url: string; sessionId: string }> {
    const data = await this._packageRepo.findById(packageId)
    if (!data) throw new DataNotFoundError()

    return this._paymentUtils.createCheckoutSession({
      amount: amount,
      currency: 'inr',
      description: `Package Plan: ${data.title}`,
      successUrl: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.FRONTEND_URL}/cancel`,
      metadata: {
        type: 'package',
        userId,
        amount: amount.toString(),
        role,
        packageId,
        couponId,
        people: maxPeople ? maxPeople.toString() : '1'
      }
    })
  }

  async getAllCoupons(userId: string): Promise<CouponDTO[]> {
    const coupons = await this._couponRepo.findAll({ usedBy: { $ne: userId } }, {})
    if (!coupons) throw new DataNotFoundError()
    return coupons.map(toCouponDTO)
  }

  async walletPurchase(userId: string, productId: string, people: number, amount: number, productType: string, couponId?: string): Promise<{ success: boolean; message: string; }> {
    // await this.
    const product = await this._packageRepo.findById(productId);
    if (!product) throw new DataNotFoundError();
    console.log(couponId)
    const coupon = couponId ? await this._couponRepo.findById(couponId) : null;
    if (couponId && !coupon) throw new DataNotFoundError();
    let discountAmount = 0;
    if (coupon) {
      if (coupon.expiryDate < new Date()) {
        return { success: false, message: 'Coupon has expired' };
      }
      if (coupon.discountType === 'percentage') {
        discountAmount = (amount * coupon.discountValue) / 100;
      } else {
        discountAmount = coupon.discountValue;
      }
    }

    const wallet = await this._walletRepo.FindByUserId(userId);
    if (!wallet) throw new DataNotFoundError();

    const pad = (n: number) => n.toString().padStart(2, '0');
    const count = (await this._orderRepo.countDocuments({}) + 1).toString().padStart(6, '0')
    const date = new Date()
    const orderId = `ORD-${pad(date.getDate())}${pad(date.getMonth() + 1)}${date.getFullYear()}-${count}`

    const orderData = await this._orderRepo.create({
      userId: new Types.ObjectId(userId),
      orderId: orderId,
      productType: 'Package',
      role: 'Agency',
      product: new Types.ObjectId(productId),
      people: 2,
      ownedBy: product.ownedBy,
      amount: amount,
      couponApplied: coupon ? String(coupon._id) : 'none',
      paymentType:'wallet',
      offer: discountAmount,
    })

    if (!orderData) throw new Data_Creation_Error();

    wallet.Balance -= amount;
    const transaction = {
      Type: 'debit',
      Amount: amount,
      Description: `Purchase of ${product.title} with order ID ${orderId}`,
      Date: new Date(),
    }
    wallet.Transaction.push(transaction);
    await this._walletRepo.update(wallet.id, wallet);

    return { success: true, message: 'Purchase successful' };
  }
}